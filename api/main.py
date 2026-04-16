"""
WMO Hackathon - FastAPI backend
Alle endpoints voor het verwerken van WMO aanvragen.
"""
import os
import hashlib
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from contextlib import contextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
import psycopg2
from psycopg2.extras import RealDictCursor, Json

# ============================================================
# CONFIG
# ============================================================
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://wmo_user:wmo_pass@localhost:5432/wmo_audit")
PSEUDO_SALT = os.getenv("PSEUDO_SALT", "change-me")
LLM_MODE = os.getenv("LLM_MODE", "stub")  # 'stub' of 'anthropic'
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

# Verboden termen voor fairness check
VERBODEN_TERMEN = [
    # Religie
    "moslim", "christen", "jood", "hindoe", "boeddhist", "islamitisch",
    "religie", "geloof", "kerk", "moskee",
    # Ras/etniciteit
    "allochtoon", "autochtoon", "buitenlander", "marokkaan", "turk",
    "neger", "blanke", "zwarte", "etniciteit", "ras",
    # Nationaliteit
    "nationaliteit", "paspoort", "vluchteling", "asielzoeker",
    # Geslacht/seksualiteit (als discriminerend gebruikt)
    "homo", "lesbisch", "transgender",
    # Politiek
    "links", "rechts", "pvv", "vvd",
]

# ============================================================
# DATABASE
# ============================================================
@contextmanager
def get_db():
    conn = psycopg2.connect(DATABASE_URL)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


# ============================================================
# MODELS
# ============================================================
class WMOAanvraag(BaseModel):
    """Ruwe aanvraag zoals ontvangen via webhook."""
    citizen_id: str = Field(..., description="BSN of intern ID")
    naam: str
    adres: str
    geboortedatum: str  # YYYY-MM-DD
    voorziening: str = Field(..., description="Bijv: huishoudelijke_hulp, rolstoel, woningaanpassing")
    problematiek: List[str] = Field(default_factory=list)
    ernst: str = Field(..., description="laag | midden | hoog")
    toelichting: str = ""
    toestemming_ai: bool = Field(..., description="Heeft burger toestemming gegeven voor AI-verwerking?")

    @field_validator("ernst")
    @classmethod
    def validate_ernst(cls, v):
        if v not in ["laag", "midden", "hoog"]:
            raise ValueError("ernst moet zijn: laag, midden of hoog")
        return v


class PseudonimiseerdeAanvraag(BaseModel):
    """Aanvraag zonder PII, klaar voor AI."""
    token: str
    leeftijdsgroep: str
    voorziening: str
    problematiek: List[str]
    ernst: str
    toelichting: str


class BeleidsRegel(BaseModel):
    voorziening: str
    criteria: List[str]
    max_uren_per_week: Optional[int] = None
    vereist_review: bool = False


class AIVoorstel(BaseModel):
    token: str
    voorstel: str
    onderbouwing: str
    geschat_risico: str  # laag | midden | hoog


class FairnessCheckInput(BaseModel):
    voorstel: str
    onderbouwing: str


class FairnessResult(BaseModel):
    passed: bool
    flags: List[str]
    reden: str


class AuditEntry(BaseModel):
    request_id: str
    token: str
    voorziening: str
    leeftijdsgroep: Optional[str] = None
    ernst: Optional[str] = None
    risico: str
    flags: List[str] = []
    ai_voorstel: Optional[str] = None
    onderbouwing: Optional[str] = None
    besluit: str  # 'auto' | 'review'
    burger_bericht: Optional[str] = None
    raw_input: Optional[Dict[str, Any]] = None


# ============================================================
# APP
# ============================================================
app = FastAPI(
    title="WMO Hackathon API",
    description="Ethisch verantwoorde AI-ondersteuning voor WMO aanvragen",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# HELPERS
# ============================================================
def pseudonimiseer(citizen_id: str) -> str:
    """Hash citizen_id met salt naar onomkeerbaar token."""
    h = hashlib.sha256(f"{PSEUDO_SALT}{citizen_id}".encode()).hexdigest()
    return f"tok_{h[:16]}"


def bereken_leeftijdsgroep(geboortedatum: str) -> str:
    """Converteer geboortedatum naar leeftijdsgroep (geen exacte datum)."""
    try:
        geboorte = datetime.strptime(geboortedatum, "%Y-%m-%d")
        leeftijd = (datetime.now() - geboorte).days // 365
        if leeftijd < 18: return "minderjarig"
        if leeftijd < 30: return "18-29"
        if leeftijd < 50: return "30-49"
        if leeftijd < 65: return "50-64"
        if leeftijd < 75: return "65-74"
        return "75+"
    except Exception:
        return "onbekend"


# ============================================================
# ENDPOINTS
# ============================================================

@app.get("/")
def root():
    return {"service": "WMO API", "status": "ok", "llm_mode": LLM_MODE}


@app.get("/health")
def health():
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
        return {"status": "healthy", "db": "connected"}
    except Exception as e:
        raise HTTPException(503, f"Database niet bereikbaar: {e}")


@app.post("/intake", response_model=PseudonimiseerdeAanvraag)
def intake(aanvraag: WMOAanvraag):
    """
    Stap 1-3: Ontvangt aanvraag, valideert, pseudonimiseert.
    Geen PII gaat verder dan dit endpoint.
    """
    if not aanvraag.toestemming_ai:
        raise HTTPException(
            400,
            "Geen toestemming voor AI-verwerking. Aanvraag wordt handmatig behandeld."
        )

    return PseudonimiseerdeAanvraag(
        token=pseudonimiseer(aanvraag.citizen_id),
        leeftijdsgroep=bereken_leeftijdsgroep(aanvraag.geboortedatum),
        voorziening=aanvraag.voorziening,
        problematiek=aanvraag.problematiek,
        ernst=aanvraag.ernst,
        toelichting=aanvraag.toelichting,
    )


# Mock beleidsregels - in productie zou dit uit een echte beleidsdatabase komen
BELEID_DB = {
    "huishoudelijke_hulp": BeleidsRegel(
        voorziening="huishoudelijke_hulp",
        criteria=[
            "Aanvrager heeft fysieke of cognitieve beperking",
            "Geen mantelzorg beschikbaar",
            "Huishoudelijke taken niet zelfstandig uitvoerbaar"
        ],
        max_uren_per_week=6,
        vereist_review=False,
    ),
    "rolstoel": BeleidsRegel(
        voorziening="rolstoel",
        criteria=[
            "Beperkte mobiliteit aangetoond",
            "Medische indicatie aanwezig",
            "Rolstoel is passend hulpmiddel"
        ],
        vereist_review=False,
    ),
    "woningaanpassing": BeleidsRegel(
        voorziening="woningaanpassing",
        criteria=[
            "Aanpassing noodzakelijk voor zelfstandig wonen",
            "Woning is eigendom of langdurige huur",
            "Kosten in verhouding tot noodzaak"
        ],
        vereist_review=True,  # altijd review vanwege hoge kosten
    ),
}


@app.get("/policy/{voorziening}", response_model=BeleidsRegel)
def get_policy(voorziening: str):
    """Stap 4: Haal beleidsregels op voor een voorziening."""
    if voorziening not in BELEID_DB:
        raise HTTPException(404, f"Geen beleid gevonden voor {voorziening}")
    return BELEID_DB[voorziening]


@app.post("/ai/propose", response_model=AIVoorstel)
def ai_propose(aanvraag: PseudonimiseerdeAanvraag):
    """
    Stap 5: Genereer AI-voorstel.
    Alleen gepseudonimiseerde data wordt naar LLM gestuurd.
    """
    beleid = BELEID_DB.get(aanvraag.voorziening)

    if LLM_MODE == "stub":
        return _stub_propose(aanvraag, beleid)
    elif LLM_MODE == "anthropic":
        return _anthropic_propose(aanvraag, beleid)
    else:
        raise HTTPException(500, f"Onbekende LLM_MODE: {LLM_MODE}")


def _stub_propose(aanvraag: PseudonimiseerdeAanvraag, beleid) -> AIVoorstel:
    """Stub die deterministische antwoorden geeft voor demo testcases."""
    # Testcase 3: fairness flag trigger (toelichting bevat verboden term)
    toelichting_lower = aanvraag.toelichting.lower()
    if "moslim" in toelichting_lower or "allochtoon" in toelichting_lower:
        return AIVoorstel(
            token=aanvraag.token,
            voorstel="Toekennen van aangevraagde voorziening",
            onderbouwing=f"Aanvrager is moslim en heeft extra steun nodig gezien culturele achtergrond.",
            geschat_risico="laag",
        )

    # Risico bepalen
    risico = "laag"
    if len(aanvraag.problematiek) >= 3 or aanvraag.ernst == "hoog":
        risico = "hoog"
    elif aanvraag.ernst == "midden" or len(aanvraag.problematiek) >= 2:
        risico = "midden"

    # Voorstel
    if risico == "hoog":
        voorstel = f"Voorstel: uitgebreide beoordeling {aanvraag.voorziening} met maatwerk"
        onderbouwing = (
            f"Op basis van meervoudige problematiek ({len(aanvraag.problematiek)} factoren) "
            f"en ernst {aanvraag.ernst} is specialistische beoordeling gewenst. "
            f"Leeftijdsgroep {aanvraag.leeftijdsgroep}. "
            f"Aanbeveling: menselijke beoordelaar betrekken voor maatwerk."
        )
    else:
        voorstel = f"Voorstel: toekennen standaard {aanvraag.voorziening}"
        onderbouwing = (
            f"Aanvraag voldoet aan standaardcriteria voor {aanvraag.voorziening}. "
            f"Ernst: {aanvraag.ernst}. Leeftijdsgroep: {aanvraag.leeftijdsgroep}. "
            f"Beleidsregels: {', '.join(beleid.criteria[:2]) if beleid else 'n.v.t.'}"
        )

    return AIVoorstel(
        token=aanvraag.token,
        voorstel=voorstel,
        onderbouwing=onderbouwing,
        geschat_risico=risico,
    )


def _anthropic_propose(aanvraag: PseudonimiseerdeAanvraag, beleid) -> AIVoorstel:
    """Echte LLM call naar Claude."""
    try:
        from anthropic import Anthropic
        client = Anthropic(api_key=ANTHROPIC_API_KEY)

        prompt_charter = """Je bent een AI-ondersteuningssysteem voor WMO-aanvragen.

REGELS:
- Je beslist NOOIT zelf, je doet alleen voorstellen
- Verwijs NOOIT naar religie, ras, nationaliteit, geslacht, seksuele oriëntatie of politieke overtuiging
- Gebruik alleen de gepseudonimiseerde data die je krijgt
- Geef altijd onderbouwing bij je voorstel
- Bij twijfel of complexe casus: adviseer menselijke beoordeling
- Toon: professioneel, helder, B1-niveau Nederlands
- Schat risico in op: laag, midden of hoog"""

        user_msg = f"""Aanvraag:
- Voorziening: {aanvraag.voorziening}
- Leeftijdsgroep: {aanvraag.leeftijdsgroep}
- Problematiek: {', '.join(aanvraag.problematiek)}
- Ernst: {aanvraag.ernst}
- Toelichting: {aanvraag.toelichting}

Beleidscriteria: {', '.join(beleid.criteria) if beleid else 'n.v.t.'}

Geef een voorstel in JSON formaat:
{{"voorstel": "...", "onderbouwing": "...", "geschat_risico": "laag|midden|hoog"}}"""

        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=500,
            system=prompt_charter,
            messages=[{"role": "user", "content": user_msg}]
        )

        import json
        text = response.content[0].text
        # Extract JSON
        start = text.find("{")
        end = text.rfind("}") + 1
        data = json.loads(text[start:end])

        return AIVoorstel(
            token=aanvraag.token,
            voorstel=data["voorstel"],
            onderbouwing=data["onderbouwing"],
            geschat_risico=data["geschat_risico"],
        )
    except Exception as e:
        # Fallback naar stub bij fouten
        return _stub_propose(aanvraag, beleid)


@app.post("/fairness/check", response_model=FairnessResult)
def fairness_check(input: FairnessCheckInput):
    """
    Stap 6: Check voorstel + onderbouwing op verboden termen.
    Check ook of onderbouwing voldoende is.
    """
    flags = []
    text = f"{input.voorstel} {input.onderbouwing}".lower()

    for term in VERBODEN_TERMEN:
        if term in text:
            flags.append(f"verboden_term:{term}")

    # Check onderbouwing lengte
    if len(input.onderbouwing.strip()) < 30:
        flags.append("onderbouwing_te_kort")

    passed = len(flags) == 0
    reden = "Geen issues gevonden" if passed else f"Issues gevonden: {', '.join(flags)}"

    return FairnessResult(passed=passed, flags=flags, reden=reden)


@app.post("/audit/log")
def audit_log(entry: AuditEntry):
    """Stap 9: Log beslissing in audit DB."""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO audit_log (
                    request_id, token, voorziening, leeftijdsgroep, ernst,
                    risico, flags, ai_voorstel, onderbouwing, besluit,
                    burger_bericht, raw_input
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                entry.request_id, entry.token, entry.voorziening,
                entry.leeftijdsgroep, entry.ernst, entry.risico,
                Json(entry.flags), entry.ai_voorstel, entry.onderbouwing,
                entry.besluit, entry.burger_bericht,
                Json(entry.raw_input) if entry.raw_input else None,
            ))
            audit_id = cur.fetchone()[0]
    return {"status": "logged", "audit_id": audit_id, "request_id": entry.request_id}


@app.get("/audit")
def get_audit_log(limit: int = 50):
    """Haal recente audit entries op."""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT * FROM audit_log ORDER BY created_at DESC LIMIT %s",
                (limit,)
            )
            rows = cur.fetchall()
    return {"count": len(rows), "entries": rows}


@app.get("/review/queue")
def review_queue():
    """Reviewer dashboard: alle aanvragen die handmatige beoordeling vereisen."""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM review_queue")
            rows = cur.fetchall()
    return {"count": len(rows), "queue": rows}


@app.post("/process")
def process_full(aanvraag: WMOAanvraag):
    """
    END-TO-END endpoint: doet alle stappen in één call.
    Voor testing / fallback als n8n niet werkt.
    """
    request_id = f"req_{uuid.uuid4().hex[:12]}"

    # 1-3: Intake + pseudonimiseren
    try:
        pseudo = intake(aanvraag)
    except HTTPException as e:
        # Validatie faalt - log en return foutmelding
        token = pseudonimiseer(aanvraag.citizen_id) if aanvraag.citizen_id else "tok_unknown"
        audit_entry = AuditEntry(
            request_id=request_id,
            token=token,
            voorziening=aanvraag.voorziening,
            risico="onbekend",
            flags=["validatie_gefaald"],
            besluit="geweigerd",
            burger_bericht="Uw aanvraag kon niet worden verwerkt: geen toestemming voor AI.",
            raw_input=aanvraag.model_dump(),
        )
        audit_log(audit_entry)
        raise

    # 4: Beleid
    try:
        beleid = get_policy(pseudo.voorziening)
    except HTTPException:
        beleid = None

    # 5: AI voorstel
    voorstel = ai_propose(pseudo)

    # 6: Fairness check
    fairness = fairness_check(FairnessCheckInput(
        voorstel=voorstel.voorstel,
        onderbouwing=voorstel.onderbouwing,
    ))

    # 7: Routing besluit
    needs_review = (
        voorstel.geschat_risico == "hoog"
        or aanvraag.ernst == "hoog"
        or len(aanvraag.problematiek) >= 3
        or not fairness.passed
        or (beleid and beleid.vereist_review)
    )

    if needs_review:
        besluit = "review"
        burger_bericht = (
            "Bedankt voor uw WMO-aanvraag. Uw aanvraag wordt zorgvuldig beoordeeld "
            "door een medewerker van de gemeente. U ontvangt binnen 5 werkdagen bericht. "
            "Een AI-systeem heeft uw aanvraag voorbereid; de uiteindelijke beslissing wordt "
            "genomen door een mens."
        )
    else:
        besluit = "auto"
        burger_bericht = (
            f"Bedankt voor uw WMO-aanvraag voor {pseudo.voorziening}. "
            f"Op basis van uw gegevens hebben wij het volgende voorstel: {voorstel.voorstel}. "
            f"Een medewerker van de gemeente bevestigt dit besluit binnen 3 werkdagen. "
            f"Let op: een AI-systeem heeft dit voorstel voorbereid; de definitieve "
            f"beslissing wordt altijd door een mens gecontroleerd."
        )

    # 9: Audit log
    audit_entry = AuditEntry(
        request_id=request_id,
        token=pseudo.token,
        voorziening=pseudo.voorziening,
        leeftijdsgroep=pseudo.leeftijdsgroep,
        ernst=pseudo.ernst,
        risico=voorstel.geschat_risico,
        flags=fairness.flags,
        ai_voorstel=voorstel.voorstel,
        onderbouwing=voorstel.onderbouwing,
        besluit=besluit,
        burger_bericht=burger_bericht,
    )
    audit_log(audit_entry)

    # 8: Response naar burger
    return {
        "request_id": request_id,
        "token": pseudo.token,
        "besluit": besluit,
        "burger_bericht": burger_bericht,
        "transparantie": {
            "ai_voorstel": voorstel.voorstel,
            "onderbouwing": voorstel.onderbouwing,
            "risico": voorstel.geschat_risico,
            "fairness_flags": fairness.flags,
            "review_vereist": needs_review,
        }
    }
