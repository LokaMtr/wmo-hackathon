#!/bin/bash
# Test script voor de 4 demo testcases
# Run: bash test_cases.sh

API="http://localhost:8000"

echo "================================"
echo "TESTCASE 1: Laag risico (neutraal)"
echo "================================"
curl -s -X POST $API/process \
  -H "Content-Type: application/json" \
  -d '{
    "citizen_id": "123456789",
    "naam": "Jan de Vries",
    "adres": "Hoofdstraat 1, Utrecht",
    "geboortedatum": "1955-03-15",
    "voorziening": "huishoudelijke_hulp",
    "problematiek": ["mobiliteit"],
    "ernst": "laag",
    "toelichting": "Moeite met zware huishoudelijke taken na heupoperatie.",
    "toestemming_ai": true
  }' | python3 -m json.tool

echo ""
echo "================================"
echo "TESTCASE 2: Hoog risico (mens-in-de-loop)"
echo "================================"
curl -s -X POST $API/process \
  -H "Content-Type: application/json" \
  -d '{
    "citizen_id": "987654321",
    "naam": "Maria Jansen",
    "adres": "Dorpsweg 42, Zeist",
    "geboortedatum": "1945-07-22",
    "voorziening": "woningaanpassing",
    "problematiek": ["mobiliteit", "dementie", "sociale_isolatie", "financieel"],
    "ernst": "hoog",
    "toelichting": "Ernstige situatie, meerdere zorgvragen tegelijk.",
    "toestemming_ai": true
  }' | python3 -m json.tool

echo ""
echo "================================"
echo "TESTCASE 3: Fairness flag (verboden term)"
echo "================================"
curl -s -X POST $API/process \
  -H "Content-Type: application/json" \
  -d '{
    "citizen_id": "555666777",
    "naam": "Ahmed Hassan",
    "adres": "Kanaalstraat 10, Utrecht",
    "geboortedatum": "1970-01-10",
    "voorziening": "huishoudelijke_hulp",
    "problematiek": ["mobiliteit"],
    "ernst": "midden",
    "toelichting": "Aanvrager is moslim en heeft culturele overwegingen.",
    "toestemming_ai": true
  }' | python3 -m json.tool

echo ""
echo "================================"
echo "TESTCASE 4: Validatie faalt (geen toestemming)"
echo "================================"
curl -s -X POST $API/process \
  -H "Content-Type: application/json" \
  -d '{
    "citizen_id": "111222333",
    "naam": "Piet Pietersen",
    "adres": "Schoolstraat 5, Amersfoort",
    "geboortedatum": "1960-05-20",
    "voorziening": "rolstoel",
    "problematiek": ["mobiliteit"],
    "ernst": "laag",
    "toelichting": "Rolstoel nodig.",
    "toestemming_ai": false
  }' | python3 -m json.tool

echo ""
echo "================================"
echo "AUDIT LOG (laatste entries)"
echo "================================"
curl -s $API/audit?limit=10 | python3 -m json.tool
