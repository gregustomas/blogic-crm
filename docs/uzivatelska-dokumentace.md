# Uživatelská dokumentace — Blogic CRM

Živá aplikace: https://blogic-crm.gregustomas.workers.dev/

---

Blogic CRM je webová aplikace pro správu klientů, poradců a smluv. Umožňuje evidovat smluvní vztahy, sledovat platnost smluv a exportovat data. Funguje v prohlížeči na počítači i na telefonu.

---

## Přihlášení

Po otevření aplikace se zobrazí přihlašovací formulář. Zadejte e-mail a heslo a klikněte na **Přihlásit se**.

![Přihlašovací obrazovka](screens/login.png)

---

## Navigace

Po přihlášení uvidíte postranní panel vlevo se čtyřmi sekcemi: Přehled, Smlouvy, Klienti a Poradci. Panel lze sbalit kliknutím na ikonu vlevo nahoře — zůstanou jen ikony. Na telefonu se panel otevírá jako překryvná vrstva a zavírá křížkem v jeho rohu nebo kliknutím na libovolnou položku.

---

## Přehled

Dashboard je úvodní obrazovka po přihlášení.

![Dashboard](screens/dashboard.png)

Nahoře jsou pět karet s klíčovými čísly: celkový počet smluv, aktivní smlouvy, smlouvy vypršující do 30 dní, počet klientů a počet poradců. Karta "Vyprší za 30 dní" se zvýrazní oranžově, jakmile takové smlouvy existují.

Pod kartami jsou dva grafy. Sloupcový ukazuje počty smluv podepsaných v každém z posledních 12 měsíců, koláčový zobrazuje poměr aktivních a prošlých smluv.

Vlevo dole je seznam smluv, jejichž platnost vyprší do 30 dní, seřazený od nejbližšího data. Vpravo jsou rychlé akce s odkazy na správu smluv, klientů a poradců.

---

## Klienti

![Seznam klientů](screens/clients.png)

Tabulka zobrazuje všechny klienty se jménem, e-mailem, telefonem a věkem. Věk se počítá automaticky z rodného čísla, takže je vždy aktuální bez nutnosti ručních úprav.

**Vyhledávání** funguje po zadání alespoň 3 znaků. Prohledává jméno, e-mail, telefon i rodné číslo zároveň.

### Přidání klienta

Klikněte na **Přidat klienta** vpravo nahoře. Vyplňte jméno, příjmení, e-mail, telefon a rodné číslo a uložte. Systém při ukládání ověří, že zadaný e-mail ani rodné číslo v systému ještě nejsou a že je klientovi mezi 18 a 100 lety.

### Úprava a smazání

U každého řádku jsou tři ikony: oko pro zobrazení detailu, tužka pro úpravu a koš pro smazání. Klienta nelze smazat, pokud má evidované smlouvy — systém zobrazí upozornění a smazání zablokuje.

### Detail klienta

Kliknutím na řádek (nebo na oko) se otevře detail klienta.

![Detail klienta](screens/client-detail.png)

V levé části jsou kontaktní údaje — e-mail, telefon, rodné číslo a věk. V pravé části je přehled smluv s počty celkem, platných a prošlých. Pod tím je seznam všech smluv daného klienta s evidenčním číslem, institucí, správcem a datem platnosti. Prošlé smlouvy mají datum zvýrazněno červeně.

### Export

Tlačítko **Exportovat** nabídne tři formáty: CSV, Excel a PDF. Exportují se vždy data aktuálně viditelná v tabulce, tedy po případném filtrování vyhledáváním.

---

## Poradci

![Seznam poradců](screens/advisors.png)

Stránka Poradci funguje stejně jako Klienti. Jsou tu ale dvě odlišnosti.

Poradce nelze smazat, pokud je u některé smlouvy nastaven jako správce. Systém zobrazí upozornění a požádá o změnu správce na dané smlouvě. Pokud je poradce pouze účastníkem smluv a ne správcem, je z těchto smluv automaticky odebrán při smazání.

### Detail poradce

![Detail poradce](screens/advisor-detail.png)

Na detailní stránce poradce jsou smlouvy rozdělené do tří záložek: **Všechny**, **Správce** a **Účastník**. Ikonou štítu jsou označeny smlouvy, kde je poradce správcem, ikonou osoby smlouvy, kde je účastníkem.

---

## Smlouvy

![Seznam smluv](screens/contracts.png)

Tabulka zobrazuje evidenční číslo, instituci, klienta, správce, data platnosti a počet poradců. Prošlé smlouvy mají datum konce platnosti zvýrazněné červeně.

**Záložky** nad tabulkou filtrují smlouvy na tři skupiny:

- **Všechny** zobrazuje kompletní seznam
- **Platné** zobrazuje smlouvy, které ještě nevypršely nebo nemají nastavené datum konce
- **Prošlé** zobrazuje smlouvy s datem konce v minulosti

Záložky a vyhledávání lze kombinovat.

### Přidání smlouvy

![Formulář pro přidání smlouvy](screens/create-contract.png)

Klikněte na **Přidat smlouvu**. Vyplňte evidenční číslo, instituci, klienta, správce smlouvy, účastníky a data. Pole **Platnost do** je nepovinné — pokud ho necháte prázdné, smlouva nemá stanovený konec platnosti.

Systém kontroluje, že datum podpisu není pozdější než datum začátku platnosti a že datum konce platnosti není dřívější než začátek platnosti.

### Detail smlouvy

![Detail smlouvy](screens/contract-detail.png)

Detail zobrazuje všechny informace o smlouvě — číslo, instituci, datum podpisu a platnosti. Vpravo je status smlouvy (Platná nebo Prošlá) a počet zbývajících dní. Dole v sekci Osoby jsou uvedeni klient a správce smlouvy.

---

## Odhlášení

Klikněte na **Odhlásit se** v dolní části postranního panelu.

---

## Časté situace

**Nejde smazat klient.** Klient má evidované smlouvy. Smlouvy je nutné nejdříve smazat nebo přeřadit jinému klientovi.

**Nejde smazat poradce.** Poradce je nastaven jako správce alespoň jedné smlouvy. Otevřete danou smlouvu, přiřaďte jiného správce a pak poradce smažte.

**Věk je špatný.** Věk se počítá automaticky z rodného čísla při každém načtení stránky. Pokud je věk nesprávný, zkontrolujte zadané rodné číslo v detailu klienta nebo poradce.

**Smlouva nejde přidat.** Evidenční číslo, které zadáváte, už v systému existuje. Každé evidenční číslo musí být jedinečné.
