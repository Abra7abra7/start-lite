import React from 'react';
import { Metadata } from 'next';

// Metadáta pre stránku Obchodné podmienky
export const metadata: Metadata = {
  title: 'Obchodné Podmienky | Víno Pútec Vinosady',
  description: 'Prečítajte si aktuálne obchodné podmienky platné pre nákup v e-shope vinárstva Víno Pútec. Informácie o objednávaní, platbe, doprave a reklamáciách.',
};

export default function ObchodnePodmienkyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-primary">Obchodné podmienky</h1>
      <div className="prose max-w-none dark:prose-invert mx-auto">
        <h2 className="mt-8 mb-4 text-2xl font-semibold">1. Všeobecné ustanovenia</h2>
        <ol>
          <li>Tieto obchodné podmienky sa vzťahujú na obchodné vzťahy medzi kupujúcim a predávajúcim uzatvorené prostredníctvom systému elektronického obchodu (ďalej len “e-shop”).</li>
          <li>Predávajúcim a prevádzkovateľom e-shopu je obchodná spoločnosť (ďalej ako „predávajúci“ alebo “prevádzkovateľ”):
            <div className="my-4 p-4 border rounded not-prose">
                <strong>Putec s.r.o.</strong><br />
                Pezinská 154,<br />
                902 01 Vinosady,<br />
                Slovensko<br />
                IČO: 36658774<br />
                DIČ: 2022219430<br />
                IČ DPH: SK2022219430<br />
                TEL: +421 903 465 666<br />
                E-mail: brano.putec@gmail.com<br />
                Bankové spojenie – IBAN: SK08 7500 0000 0040 3035 3200
            </div>
          </li>
          <li>Obchodné podmienky bližšie vymedzujú a upresňujú práva a povinnosti predávajúceho a kupujúceho a vo svojom aktuálnom znení tvoria neoddeliteľnú súčasť kúpnej zmluvy. Kúpna zmluva medzi predávajúcim a kupujúcim sa uzatvára konkludentne, spôsobom uvedeným v čl. II bod 5 a 6.</li>
          <li>Kupujúcim sa rozumie fyzická alebo právnická osoba, ktorá prostredníctvom nákupného košíka odoslala po vlastnej autorizácii elektronickú objednávku, spracovanú systémom e-shopu.</li>
          <li>Tovarom sa rozumejú všetky produkty uvedené v platnom prehľade na stránkach e-shopu.</li>
          <li>Elektronickou objednávkou sa rozumie odoslaný elektronický formulár spracovaný systémom obchodu obsahujúci informácie o kupujúcom, zoznam objednaného tovaru z ponuky e-shopu a cenu objednaného tovaru.</li>
          <li>Registráciou sa rozumie zaregistrovanie zákazníka pred objednávkou tovaru.</li>
        </ol>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">2. Objednávanie tovaru</h2>
        <ol>
          <li>Objednávanie v e-shope sa uskutočňuje prostredníctvom nákupného košíka.</li>
          <li>Pri objednávke tovaru kupujúci vyplní povinné polia vo formulári, inak objednávku nie je možné potvrdiť.</li>
          <li>Objednávky sú do systému zaraďované podľa poradia, v akom prichádzajú.</li>
          <li>Podmienkou platnosti elektronickej objednávky je pravdivé a úplné vyplnenie všetkých, registračným formulárom požadovaných údajov a náležitostí, ktoré umožnia bezproblémové doručenie zásielky s objednaným tovarom.</li>
          <li>Elektronická objednávka odoslaná kupujúcim predávajúcemu je považovaná za návrh na uzatvorenie zmluvy a je záväzná.</li>
          <li>Potvrdením elektronickej objednávky e-mailom dôjde k akceptácii návrhu na uzatvorenie zmluvy predávajúcim. Momentom akceptácie návrhu na uzatvorenie zmluvy dôjde k vlastnému uzavretiu kúpnej zmluvy medzi predávajúcim a kupujúcim.</li>
          <li>Pokiaľ objednávaný tovar nie je na sklade a nie je možné z rôznych dôvodov doobjednať tak, aby bol kupujúcemu doručený v rámci dodacej lehoty, upozorní predávajúci kupujúceho e-mailom alebo telefonicky na dané skutočnosti. Kupujúci má právo v takomto prípade svoju objednávku zrušiť alebo upraviť podľa vzájomnej dohody.</li>
          <li>Kupujúci si pri objednávke tovaru vyberie možnosť dodania tovaru: expresné doručenie kuriérom. Cena tovaru a poplatok za dodanie tovaru uvedené na potvrdenej objednávke sú konečné.</li>
          <li>V prípade akciových ponúk – preddefinovaných balíčkov, hodnota balíčka neobsahuje úhradu za doručenie tovaru, pokiaľ nie je uvedené inak.</li>
          <li>Zľavy vyplývajúce z jednotlivých akcií nie je možné kumulovať.</li>
        </ol>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">3. Ceny tovaru</h2>
        <ol>
          <li>Pri každom výrobku v e-shope je uvedená cena v eurách s DPH (konečná cena). Predávajúci sa zaväzuje dodržať ceny dané v potvrdenej objednávke kupujúceho.</li>
          <li>Predávajúci má právo ceny aktualizovať a meniť v prípade zmien cien na trhu alebo od svojho dodávateľa aj bez upozornenia.</li>
        </ol>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">4. Spôsob platby</h2>
        <ol>
          <li>Kupujúci si vyberie na stránke spôsob platby. Kupujúcemu bude vystavená faktúra ktorá bude súčasťou zásielky. Po zaplatení bude kupujúcemu zaslaný tovar kuriérskou službou.</li>
          <li>Spolu s tovarom dostane kupujúci faktúru ako daňový doklad, ktorú je v prípade reklamácie povinný predložiť.</li>
        </ol>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">5. Dodanie tovaru</h2>
        <ol>
          <li>Tovar predávajúci dodá na miesto plnenia uvedené kupujúcim v registračnom formulári a je ním sídlo, miesto podnikania alebo bydlisko kupujúceho. V prípade osobného odberu tovaru kupujúcim je miestom dodania sídlo predávajúceho.</li>
          <li>Predávajúci dodá kupujúcemu tovar so statusom „na sklade“ v lehote 1-3 pracovných dní. Lehota na dodanie tovaru môže byť vo výnimočných prípadoch dlhšia, o čom bude kupujúci včas informovaný.</li>
          <li>Predávajúci k cene objednaného tovaru účtuje poplatok za dodanie tovaru podľa spôsobu doručenia vo výške uvedenej pri potvrdení objednávky</li>
          <li>V prípade, že objednávka nemôže byť jednorazovo úplne vybavená, kupujúci zaplatí poplatok za dodanie uvedený v objednávke a za dodatočne zaslaný tovar z čiastočne vybavenej objednávky už poplatok neplatí.</li>
          <li>Dopravca tovaru – kuriérska spoločnosť ručí za zásielku do okamihu jej odovzdania kupujúcemu. Ten je povinný prezrieť si zásielku pri preberaní a v prípade viditeľného poškodenia, či dokonca straty časti tovaru, spíše s dopravcom reklamačný protokol a zásielku nepreberie. Hneď ako dopravca zásielku vráti predávajúcemu, predávajúci vyexpeduje nový tovar kupujúcemu.</li>
        </ol>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">6. Vrátenie tovaru</h2>
        <ol>
          <li>Kupujúci je oprávnený odstúpiť od kúpnej zmluvy bez udania dôvodu v súlade s ust. § 7 a nasl. Zákona č. 102/2014 Z.z. o ochrane spotrebiteľa pri predaji tovaru alebo poskytovaní služieb na základe zmluvy uzavretej na diaľku alebo zmluvy uzavretej mimo prevádzkových priestorov predávajúceho a o zmene a doplnení niektorých zákonov (ďalej len „Zákon o ochrane spotrebiteľa pri predaji na diaľku“) v lehote 14 dní od prevzatia tovaru. Kupujúci môže odstúpiť od zmluvy, predmetom ktorej je dodanie tovaru, aj pred začatím plynutia lehoty na odstúpenie od zmluvy. Lehota na odstúpenie od zmluvy sa považuje za zachovanú, ak oznámenie o odstúpení od zmluvy bolo odoslané predávajúcemu najneskôr v posledný deň lehoty. Právo na odstúpenie od zmluvy má kupujúci aj v prípade, ak bol tovar, objednaný prostredníctvom internetu, vyzdvihnutý osobne priamo u predávajúceho.</li>
          <li>Kupujúci je povinný najneskôr do 14 dní odo dňa odstúpenia od zmluvy zaslať tovar späť alebo ho odovzdať predávajúcemu, alebo osobe poverenej predávajúcim na prevzatie tovaru, a to na adresu sídla predávajúceho: Pezinská 154, Vinosady 902 01. Lehota podľa prvej vety sa považuje za zachovanú, ak bol tovar odovzdaný na prepravu najneskôr v posledný deň lehoty. Pri odstúpení od zmluvy znáša kupujúci náklady na vrátenie tovaru predávajúcemu alebo osobe poverenej predávajúcim na prevzatie tovaru.</li>
          <li>Predávajúci je povinný bez zbytočného odkladu, najneskôr do 14 dní odo dňa doručenia oznámenia o odstúpení od zmluvy vrátiť spotrebiteľovi všetky platby, ktoré od neho prijal na základe zmluvy alebo v súvislosti s ňou, vrátane nákladov na dopravu, dodanie a poštovné a iných nákladov a poplatkov, a to rovnakým spôsobom, aký použil kupujúci pri svojej platbe. Predávajúci však nie je povinný vrátiť kupujúcemu predmetné platby pred tým, ako mu je tovar doručený alebo kým spotrebiteľ nepreukáže zaslanie tovaru späť predávajúcemu. Predávajúci nie je povinný uhradiť kupujúcemu dodatočné náklady, ak si spotrebiteľ výslovne zvolil iný spôsob doručenia, ako je najlacnejší bežný spôsob doručenia ponúkaný predávajúcim.</li>
          <li>Tovar, ktorý je vrátený bez udania dôvodu musí byť nepoužitý, zabalený a nepoškodený, inak nebude vrátenie tovaru akceptované.</li>
          <li>Po dohode môže byť vrátenie ceny za tovar uskutočnené formou výmeny za iný tovar v rovnakej cene, ktorý bude zaslaný buď s ďalšou objednávkou kupujúceho alebo samostatne. Ak sa tovar zasiela samostatne (v prípade výmeny tovaru) poplatok za dodanie nebude účtovaný, avšak iba v prípade, že ide o jeho prvú výmenu.</li>
        </ol>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">7. Reklamácia tovaru</h2>
        <ol>
          <li>Kupujúci je povinný všetok dodaný tovar prezrieť a bez zbytočného odkladu po dodaní skontrolovať jeho úplnosť. Akýkoľvek nesúlad medzi dodaným tovarom a tovarom uvedeným v sprievodnom doklade je kupujúci povinný oznámiť bezodkladne predávajúcemu.</li>
          <li>Kupujúci je oprávnený reklamovať len tovar zakúpený v e-shope predávajúceho.</li>
          <li>Kupujúci písomnú reklamáciu a reklamovaný výrobok zašle spolu s kópiou faktúry a dokladu o zaplatení na adresu predávajúceho: Pezinská 154, Vinosady 902 01</li>
          <li>Reklamácie tovaru budú vybavované v súlade s Občianskym zákonníkom a zákonom č. 250/2007 Z.z. o ochrane spotrebiteľa v znení neskorších predpisov.</li>
        </ol>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">8. Záverečné ustanovenia</h2>
        <ol>
          <li>Právne vzťahy a podmienky tu výslovne neupravené sa riadia príslušnými ustanoveniami Občianskeho zákonníka. Práva kupujúceho vo vzťahu k predávajúcemu vyplývajúce zo zákona č. 250/2007 Z.z. o ochrane spotrebiteľa v znení neskorších právnych predpisov zostávajú týmito podmienkami nedotknuté.</li>
          <li>Predávajúci ani kupujúci nezodpovedá za oneskorené plnenie svojich záväzkov vyplývajúcich z týchto obchodných podmienok, ak takéto oneskorenie bolo spôsobené “vyššou mocou” alebo okolnosťami vylučujúcimi zodpovednosť; v takom príde má strana v omeškaní právo na primerané predĺženie lehoty pri plnení svojich záväzkov.</li>
          <li>Kupujúci vyhlasuje, že v zmysle ustanovenia § 7 ods. 1 zákona č. 428/2002 Z.z. o ochrane osobných údajov v znení neskorších predpisov, súhlasí so spracovaním a uchovávaním osobných údajov, ktoré sú potrebné pri činnosti predávajúceho a s ich spracovávaním vo všetkých informačných systémoch predávajúceho. Predávajúci sa zaväzuje, že bude s osobnými údajmi kupujúceho zaobchádzať a nakladať v súlade s platnými právnymi predpismi Slovenskej republiky. Kupujúci udeľuje predávajúcemu tento súhlas na dobu neurčitú. Súhlas so spracovaním osobných údajov môže kupujúci odvolať kedykoľvek písomnou formou. Súhlas zanikne v lehote 1 mesiaca od doručenia odvolania súhlasu kupujúcim predávajúcemu.</li>
          <li>Obchodné podmienky nadobúdajú platnosť a účinnosť dňom ich uverejnenia na internetovej stránke. Predávajúci je oprávnený ich kedykoľvek zmeniť. Zmluvné vzťahy, ktoré vznikli pred účinnosťou nových obchodných podmienok, sa riadia obchodnými podmienkami platnými a účinnými do vzniku týchto zmluvných vzťahov.</li>
          <li>Prevádzkovateľ servera využíva pre svoje marketingové potreby štatistické slúžky www.google.com/analytics, ktoré podliehajú obchodným podmienkam uvedenej služby a ochranu získaných údajov zabezpečuje v zmysle platnej európskej legislatívy.</li>
        </ol>
      </div>
    </div>
  );
}
