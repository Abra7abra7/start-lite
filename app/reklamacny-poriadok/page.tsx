import React from 'react';

export default function ReklamacnyPoriadokPage() {
  return (
    <div className="container mx-auto py-12 px-4"> {/* Added padding */}
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-primary">Reklamačný poriadok</h1> {/* Centered and styled h1 */}
      <div className="prose max-w-none dark:prose-invert mx-auto"> {/* Added dark mode support and centering */}

        <h2 className="mt-8 mb-4 text-2xl font-semibold">1. Všeobecné ustanovenia</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Na vybavovanie reklamácií sa vzťahuje platný reklamačný poriadok predávajúceho. Kupujúci bol riadne oboznámený s reklamačným poriadkom a informovaný o podmienkach a spôsobe reklamácie tovaru vrátane údajov o tom, kde možno reklamáciu uplatniť, a o vykonávaní záručných opráv v súlade s ust. § 18 ods. 1 zákona č. 250/2007 Z . z. o ochrane spotrebiteľa a o zmene zákona Slovenskej národnej rady č. 372/1990 Zb. o priestupkoch v znení neskorších predpisov (ďalej len “Zákon”) v čase pred uzavretím kúpnej zmluvy tak, že predávajúci umiestnil tieto obchodné a reklamačné podmienky na príslušnej podstránke elektronického obchodu predávajúceho a kupujúci mal možnosť si ich v čase pred odoslaním objednávky prečítať.</li>
          <li>Reklamačný poriadok sa vzťahuje na tovar zakúpený kupujúcim od predávajúceho vo forme elektronického obchodu na internetovej stránke elektronického obchodu predávajúceho.</li>
          <li>Predávajúci zodpovedá za vady, ktoré má predaný tovar pri jeho prevzatí kupujúcim. Pri použitých veciach nezodpovedá predávajúci za vady vzniknuté ich použitím alebo opotrebením. Pri veciach predávaných za nižšiu cenu nezodpovedá predávajúci za vadu, pre ktorú bola dojednaná nižšia cena.</li>
          <li>Vlastnícke právo kúpenej veci prechádza na kupujúceho okamihom zaplatenia kúpnej ceny Nadobudnutím vlastníckeho práva prechádza na kupujúceho nebezpečenstvo náhodnej skazy, zničenia a poškodenia veci.</li>
          <li>Kupujúci je povinný po prevzatí tovaru skontrolovať jeho množstvo, kvalitu a balenie a bezodkladne oznámiť predávajúcemu prípadné vady. Záruka sa vzťahuje len na tovar uvedený na dodacom liste a faktúre a týka sa všetkých vád zistených v záručnej dobe spôsobených chybou materiálu, chybnou konštrukciou alebo chybným spracovaním.</li>
          <li>Záruka sa vzťahuje na skryté vady tovaru; nevzťahuje sa na vady, ktoré vznikli neodbornou manipuláciou alebo neodborným zásahom na tovare po jeho odovzdaní kupujúcemu. Následné poškodenie povrchu predmetu dodávky škrabnutím a pod. sa nepovažuje za skrytú vadu.</li>
          <li>Reklamácia sa nevzťahuje na prirodzené starnutie a bežné opotrebovanie výrobku.</li>
        </ol>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">2. Lehoty na uplatnenie reklamácie</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Záruka na tovar je 24 mesiacov. Záručná doba začínajú plynúť odo dňa prevzatia tovaru kupujúcim. Záručná doba sa vzťahuje aj na výrobky predávané so zľavou. Ak je však poskytnutá zľava kvôli určitej vade tovaru, túto vadu potom nie je možné reklamovať.</li>
          <li>Ak je na tovare, jeho obale alebo návode vyznačená lehota na použitie (expiračná doba), záručná lehota sa neskončí pred uplynutím tejto lehoty.</li>
          <li>Ak sa na tovar vzťahuje záručná lehota dlhšia ako 24 mesiacov, je predávajúci povinný vydať kupujúcemu pri predaji záručný list s vyznačením záručnej lehoty. V záručnom liste sú uvedené podmienky a rozsah tejto záruky.</li>
          <li>Práva zo zodpovednosti za vady musí kupujúci uplatniť v záručnej lehote, inak tieto práva zanikajú.</li>
        </ol>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">3. Strata nároku na nároky zo záruky</h2>
        <p>Nároky plynúce zo záruky zanikajú, ak bol tovar:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>poškodený prepravou spotrebiteľa</li>
          <li>mechanicky poškodený neodbornou manipuláciou, alebo zlým skladovaním po prevzatí tovaru,</li>
          <li>zašpinený a neodborne vyčistený,</li>
          <li>poškodený neodborným zásahom do jeho konštrukcie,</li>
          <li>znehodnotený nadmerným používaním alebo bol používaný na iný účel než sa bežne používa.</li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">4. Miesto uplatnenia reklamácie</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Vady je povinný kupujúci bezodkladne reklamovať v sídle predávajúceho Pezinská 154, Vinosady 902 01 (reklamačné miesto) doručením vadného tovaru spolu s faktúrou a dokladom o zaplatení ceny za tovar.</li>
          <li>Ak tovar vykazuje vady, kupujúci má právo bezodkladne uplatniť reklamáciu v sídle predávajúceho: Pezinská 154, Vinosady 902 01 (reklamačné miesto) tak, že doručí predávajúcemu vadný tovar spolu s faktúrou a dokladom o zaplatení ceny za tovar a súčasne doručí predávajúcemu prejav vôle kupujúceho uplatniť si svoje právo na reklamáciu vadného tovaru napr. vo forme vyplneného formulára na uplatnenie reklamácie, ktorý je umiestnený na príslušnej podstránke elektronického obchodu predávajúceho. Predávajúci odporúča tovar pri jeho zasielaní na reklamáciu poistiť. Zásielky na dobierku predávajúci nepreberá. Kupujúci je povinný v oznámení o uplatnení reklamácie pravdivo uviesť všetky požadované informácie, najmä presne označiť druh a rozsah vady tovaru; kupujúci zároveň uvedie, ktoré zo svojich práv vyplývajúcich z ust. § 622 a 633 Občianskeho zákonníka uplatňuje.</li>
          <li>Reklamačné konanie týkajúce sa tovaru, ktorý sa dá doručiť predávajúcemu začína dňom, kedy sú splnené kumulatívne všetky nasledujúce podmienky:
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>doručenie Oznámenia o uplatnení reklamácie predávajúcemu,</li>
              <li>doručenie reklamovaného tovaru od kupujúceho predávajúcemu alebo určenej osobe,</li>
              <li>doručenie iných skutočností (napr. fotodokumentácie) k reklamovanému tovaru predávajúcemu, ak sú tieto údaje nevyhnutné na riadne vybavenie reklamácie;</li>
            </ul>
          </li>
          <li>Predávajúci alebo určená osoba vydá kupujúcemu potvrdenie o uplatnení reklamácie tovaru vo vhodnej forme, zvolenej predávajúcim, napr. vo forme mailu alebo v písomnej podobe, v ktorom je povinný presne označiť reklamované vady tovaru a ešte raz poučí spotrebiteľa o jeho právach a podľa rozhodnutia kupujúceho, ktoré z týchto práv si uplatňuje. Predávajúci je povinný určiť spôsob vybavenia reklamácie ihneď, v zložitých prípadoch najneskôr do 5 pracovných dní odo dňa uplatnenia reklamácie, v odôvodnených prípadoch, najmä ak sa vyžaduje zložité technické zhodnotenie stavu výrobku alebo služby, najneskôr do 30 dní odo dňa uplatnenia reklamácie. Vybavenie reklamácie však nesmie trvať dlhšie ako 30 dní odo dňa uplatnenia reklamácie. Po uplynutí lehoty na vybavenie reklamácie má kupujúci právo od zmluvy odstúpiť alebo má právo na výmenu výrobku za nový výrobok.</li>
          <li>Ak je reklamácia uplatnená prostredníctvom prostriedkov diaľkovej komunikácie, predávajúci je povinný potvrdenie o uplatnení reklamácie doručiť kupujúcemu ihneď; ak nie je možné potvrdenie doručiť ihneď, musí sa doručiť bez zbytočného odkladu, najneskôr však spolu s dokladom o vybavení reklamácie; potvrdenie o uplatnení reklamácie sa nemusí doručovať, ak kupujúci má možnosť preukázať uplatnenie reklamácie iným spôsobom.</li>
          <li>Predávajúci je povinný vybaviť reklamáciu a ukončiť reklamačné konanie jedným z nasledujúcich spôsobov:
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>odovzdaním opraveného tovaru,</li>
              <li>výmenou tovaru,</li>
              <li>vrátením kúpnej ceny tovaru,</li>
              <li>vyplatením primeranej zľavy z ceny tovaru,</li>
              <li>písomnou výzvou na prevzatie predávajúcim určeného plnenia,</li>
              <li>odôvodneným zamietnutím reklamácie tovaru.</li>
            </ul>
          </li>
          <li>Predávajúci je povinný o spôsobe určenia vybavenia reklamácie a o vybavení reklamácie kupujúcemu vydať písomný doklad najneskôr do 30 dní odo dňa uplatnenia reklamácie osobne, mailom, prípadne prostredníctvom poskytovateľa poštovej alebo kuriérskej alebo donáškovej služby.</li>
          <li>O výsledku vybavenia reklamácie bude predávajúci informovať kupujúceho bezprostredne po ukončení reklamačného konania telefonicky alebo e-mailom a zároveň mu bude spolu s tovarom, resp. prostredníctvom e-mailu doručený doklad o vybavení reklamácie.</li>
        </ol>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">5. Neodstrániteľné vady</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Ak ide o vadu, ktorú nemožno odstrániť a ktorá bráni tomu, aby sa vec mohla riadne užívať ako vec bez vady, má kupujúci právo na výmenu veci alebo má právo od kúpnej zmluvy odstúpiť.</li>
          <li>Ak ide o neodstrániteľnú vadu, pri ktorej možno vec používať, má kupujúci právo na primeranú zľavu z ceny tovaru. Pri určovaní výšky primeranej zľavy sa prihliada na charakter vady, stupeň a spôsob opotrebenia veci, dĺžku používania veci a možnosti jeho ďalšieho užívania.</li>
        </ol>
      </div>
    </div>
  );
}
