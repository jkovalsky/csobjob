*** Settings ***
Library           Browser
Suite Teardown    Close Browser

*** Variables ***
${BROWSER}    chromium

*** Test Cases ***
ČSOB pořád nabízí nějaká volná místa
    [Documentation]    Otevři ČSOB stránky, přijmi cookies, klikni na odkaz kariéra a ověř stránku s volnými místy
    [Tags]    csob    browser
    
    # Otevři prohlížeč a načti stránku ČSOB
    Otevři prohlížeč a načti stránku    https://www.csob.cz/
    
    # Přijmi cookies
    Klikni na element    button    Souhlasím
    
    # Klikni na odkaz "Kariéra v ČSOB a volná místa"
    Klikni na element    link    Kariéra v ČSOB a volná místa
    
    # Klikni na tlačítko "Volná místa"
    Klikni na element    link    Volná místa
    Switch Page    NEW
    
    # Ověř, že stránka obsahuje nadpis "Volná místa"
    Get Element    role=heading[name="Volná místa"]
    
ČSOB kariérní stránka umožňuje vyhledávání pozic
    [Documentation]    Otevři ČSOB kariérní stránku a ověř funkci vyhledávání volných míst
    [Tags]    csob    browser

    # Otevři prohlížeč a načti stránku s volnými místy ČSOB
    Otevři prohlížeč a načti stránku    https://careers.kbc-group.com/CSOB/search?locale=cs_CZ

    # Přijmi cookies
    Klikni na element    button    Přijmout všechny soubory cookie

    # Vyfiltruj pozice podle klíčového slova "Test"
    Wait For Elements State    [data-testid="searchByKeywords"]    visible
    Type Text    [data-testid="searchByKeywords"]    Test
    Sleep    2s
    Click  role=button[name="Vyhledat pozice"]

    # Ověř, že výsledky vyhledávání obsahují pozici "IT Test Manažer (m/ž)"
    Wait For Elements State    [data-testid="jobCard"] >> nth=0    visible
    Wait For Elements State    text=IT Test Manažer (m/ž)    visible

*** Keywords ***
Otevři prohlížeč a načti stránku
    [Arguments]    ${url}
    New Browser    ${BROWSER}    headless=true
    New Page    ${url}

Klikni na element
    [Arguments]    ${element}    ${text}
    Wait For Elements State    role=${element}\[name="${text}"]    visible
    Click  role=${element}\[name="${text}"]