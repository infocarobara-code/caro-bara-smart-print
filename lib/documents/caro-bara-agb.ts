export async function generateCaroBaraAgbPdf(): Promise<Buffer> {
  const html = buildCaroBaraAgbHtml();
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "18mm",
        right: "18mm",
        bottom: "18mm",
        left: "18mm",
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

async function launchBrowser() {
  const isServerless = Boolean(
    process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
  );

  if (isServerless) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteerCore = (await import("puppeteer-core")).default;

    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const puppeteer = (await import("puppeteer")).default;

  return puppeteer.launch({
    headless: true,
  });
}

export function buildCaroBaraAgbHtml(): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<title>Allgemeine Geschäftsbedingungen - Caro Bara Smart Print</title>
<style>
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    color: #111111;
    background: #ffffff;
    font-size: 11.5px;
    line-height: 1.55;
  }

  .document {
    width: 100%;
  }

  .header {
    border-bottom: 1px solid #111111;
    padding-bottom: 10px;
    margin-bottom: 24px;
  }

  .company {
    font-size: 12px;
    margin-bottom: 8px;
  }

  h1 {
    font-size: 22px;
    line-height: 1.25;
    margin: 0 0 6px;
    font-weight: 700;
  }

  .subtitle {
    font-size: 12px;
    color: #444444;
  }

  h2 {
    font-size: 14px;
    margin: 22px 0 8px;
    font-weight: 700;
    page-break-after: avoid;
  }

  p {
    margin: 0 0 8px;
  }

  ul {
    margin: 4px 0 10px 18px;
    padding: 0;
  }

  li {
    margin-bottom: 4px;
  }

  .section {
    page-break-inside: avoid;
  }

  .footer-info {
    margin-top: 28px;
    padding-top: 12px;
    border-top: 1px solid #999999;
    font-size: 10.5px;
    color: #333333;
  }
</style>
</head>
<body>
<div class="document">

  <div class="header">
    <div class="company">
      Caro Bara Smart Print · Fanningerstraße 20 · 10365 Berlin · Deutschland
    </div>
    <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
    <div class="subtitle">Caro Bara Smart Print</div>
  </div>

  <div class="section">
    <h2>§ 1 Geltungsbereich</h2>
    <p>
      Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge, Lieferungen und Leistungen
      von Caro Bara Smart Print, Fanningerstraße 20, 10365 Berlin, Deutschland.
    </p>
    <p>
      Sie gelten gegenüber Verbrauchern im Sinne des § 13 BGB sowie gegenüber Unternehmern im Sinne
      des § 14 BGB, soweit in diesen Bedingungen keine gesonderte Regelung getroffen wird.
    </p>
    <p>
      Abweichende Bedingungen des Kunden gelten nur, wenn Caro Bara Smart Print ihrer Geltung
      ausdrücklich in Textform zugestimmt hat.
    </p>
  </div>

  <div class="section">
    <h2>§ 2 Vertragssprache und Kommunikation</h2>
    <p>
      Vertragssprache ist Deutsch. Die Kommunikation kann per E-Mail, Telefon, schriftlich oder über
      elektronische Kommunikationswege erfolgen.
    </p>
    <p>
      Der Kunde ist verpflichtet, zutreffende Kontaktdaten anzugeben und Änderungen unverzüglich mitzuteilen.
    </p>
  </div>

  <div class="section">
    <h2>§ 3 Vertragsgegenstand</h2>
    <p>
      Caro Bara Smart Print erbringt insbesondere Leistungen in den Bereichen Druck, Werbetechnik,
      Folienbeschriftung, Schilder, Design, Branding, Verpackung, Werbeartikel, Montage,
      Installation sowie damit verbundene Beratungs- und Serviceleistungen.
    </p>
    <p>
      Art und Umfang der Leistung ergeben sich aus dem jeweiligen Angebot, der Auftragsbestätigung
      oder der individuellen Vereinbarung mit dem Kunden.
    </p>
  </div>

  <div class="section">
    <h2>§ 4 Angebote und Vertragsschluss</h2>
    <p>
      Darstellungen von Produkten und Dienstleistungen auf Webseiten, in Prospekten, E-Mails oder
      sonstigen Medien stellen kein verbindliches Angebot dar, sondern dienen der Information.
    </p>
    <p>
      Eine Bestellung oder Anfrage des Kunden gilt als verbindliches Angebot zum Abschluss eines Vertrages.
      Der Vertrag kommt erst durch Auftragsbestätigung in Textform, durch ausdrückliche Annahme oder
      durch Beginn der Leistungsausführung zustande.
    </p>
    <p>
      Bei Sonderanfertigungen, individuellen Druckaufträgen oder Montageleistungen kommt der Vertrag
      auf Grundlage der vereinbarten Spezifikationen zustande.
    </p>
  </div>

  <div class="section">
    <h2>§ 5 Preise und Zahlungsbedingungen</h2>
    <p>
      Alle Preise verstehen sich in Euro. Soweit nicht anders angegeben, enthalten die Preise die
      gesetzliche Umsatzsteuer.
    </p>
    <p>
      Caro Bara Smart Print ist berechtigt, Vorauszahlungen, Abschlagszahlungen oder vollständige Zahlung
      vor Produktionsbeginn zu verlangen.
    </p>
    <p>
      Rechnungen sind sofort nach Erhalt ohne Abzug fällig, sofern keine andere Zahlungsfrist vereinbart wurde.
    </p>
    <p>
      Gerät der Kunde in Zahlungsverzug, ist Caro Bara Smart Print berechtigt, gesetzliche Verzugszinsen
      sowie notwendige Mahn- und Rechtsverfolgungskosten geltend zu machen.
    </p>
  </div>

  <div class="section">
    <h2>§ 6 Mitwirkungspflichten des Kunden</h2>
    <p>
      Der Kunde ist verpflichtet, alle für die Durchführung des Auftrags notwendigen Informationen,
      Daten, Dateien, Maße, Texte, Bilder, Logos und Freigaben vollständig, korrekt und rechtzeitig
      bereitzustellen.
    </p>
    <p>
      Verzögerungen, die durch unvollständige, fehlerhafte oder verspätete Mitwirkung des Kunden entstehen,
      gehen nicht zu Lasten von Caro Bara Smart Print.
    </p>
  </div>

  <div class="section">
    <h2>§ 7 Druckdaten, Inhalte und Freigaben</h2>
    <p>
      Die Produktion erfolgt auf Grundlage der vom Kunden gelieferten oder freigegebenen Daten.
      Der Kunde ist für die Richtigkeit der Inhalte, Schreibweisen, Maße, Farben, Layouts und sonstigen
      Angaben verantwortlich.
    </p>
    <p>
      Eine inhaltliche, rechtliche oder technische Prüfung erfolgt nur, wenn dies ausdrücklich vereinbart wurde.
    </p>
    <p>
      Erteilt der Kunde eine Druckfreigabe, Produktionsfreigabe oder Montagefreigabe, gilt der freigegebene
      Stand als verbindliche Grundlage der Leistung.
    </p>
  </div>

  <div class="section">
    <h2>§ 8 Urheberrechte, Markenrechte und Rechte Dritter</h2>
    <p>
      Der Kunde versichert, dass er zur Nutzung, Vervielfältigung und Weitergabe aller von ihm gelieferten
      Inhalte berechtigt ist.
    </p>
    <p>
      Verletzt ein Auftrag Rechte Dritter, insbesondere Urheber-, Marken-, Namens-, Persönlichkeits-
      oder sonstige Schutzrechte, stellt der Kunde Caro Bara Smart Print von sämtlichen Ansprüchen Dritter frei.
    </p>
    <p>
      Caro Bara Smart Print ist berechtigt, Aufträge abzulehnen oder abzubrechen, wenn Inhalte gegen
      geltendes Recht, Rechte Dritter oder die guten Sitten verstoßen.
    </p>
  </div>

  <div class="section">
    <h2>§ 9 Gestaltung, Entwürfe und Nutzungsrechte</h2>
    <p>
      Von Caro Bara Smart Print erstellte Entwürfe, Designs, Layouts, Grafiken, technische Zeichnungen
      und Konzepte bleiben geistiges Eigentum von Caro Bara Smart Print, sofern keine abweichende
      Vereinbarung getroffen wurde.
    </p>
    <p>
      Der Kunde erhält nur die Nutzungsrechte, die für den vereinbarten Zweck erforderlich sind.
      Eine Weitergabe, Veränderung, Vervielfältigung oder Nutzung für andere Zwecke bedarf der Zustimmung
      von Caro Bara Smart Print.
    </p>
  </div>

  <div class="section">
    <h2>§ 10 Produktionsbedingte Abweichungen</h2>
    <p>
      Produktionsbedingt können geringfügige Abweichungen auftreten. Diese stellen keinen Mangel dar,
      soweit sie branchenüblich oder technisch unvermeidbar sind.
    </p>
    <p>
      Dies betrifft insbesondere Farbabweichungen, Materialabweichungen, Schneide- und Falztoleranzen,
      Maßtoleranzen, geringfügigen Versatz, Oberflächenunterschiede sowie Unterschiede zwischen
      Bildschirmdarstellung und Druckergebnis.
    </p>
  </div>

  <div class="section">
    <h2>§ 11 Lieferung, Abholung und Leistungszeit</h2>
    <p>
      Liefer- und Leistungszeiten sind nur verbindlich, wenn sie ausdrücklich als verbindlich bestätigt wurden.
      Lieferfristen beginnen erst, wenn alle erforderlichen Daten, Freigaben und Zahlungen vorliegen.
    </p>
    <p>
      Verzögerungen aufgrund höherer Gewalt, technischer Störungen, Lieferengpässen, Krankheit,
      behördlicher Maßnahmen oder sonstiger unvorhersehbarer Ereignisse verlängern die Leistungszeit angemessen.
    </p>
  </div>

  <div class="section">
    <h2>§ 12 Versand und Gefahrübergang</h2>
    <p>
      Erfolgt ein Versand, geschieht dieser an die vom Kunden angegebene Lieferadresse.
      Die Gefahr des Verlusts oder der Beschädigung geht, soweit gesetzlich zulässig, mit Übergabe
      an das Transportunternehmen auf den Kunden über.
    </p>
    <p>
      Der Kunde ist verpflichtet, offensichtliche Transportschäden unverzüglich beim Zusteller und bei
      Caro Bara Smart Print anzuzeigen.
    </p>
  </div>

  <div class="section">
    <h2>§ 13 Montage und Installation</h2>
    <p>
      Bei Montage- und Installationsleistungen hat der Kunde sicherzustellen, dass der Montageort
      zugänglich, vorbereitet und geeignet ist.
    </p>
    <p>
      Zusätzliche Kosten, die durch erschwerte Bedingungen, Wartezeiten, fehlende Zugänge,
      ungeeignete Untergründe oder nicht mitgeteilte Besonderheiten entstehen, trägt der Kunde.
    </p>
    <p>
      Caro Bara Smart Print haftet nicht für Schäden, die auf ungeeignete Untergründe, verdeckte Leitungen,
      bauliche Mängel oder fehlerhafte Angaben des Kunden zurückzuführen sind.
    </p>
  </div>

  <div class="section">
    <h2>§ 14 Widerrufsrecht für Verbraucher</h2>
    <p>
      Verbrauchern steht grundsätzlich ein gesetzliches Widerrufsrecht zu.
    </p>
    <p>
      Das Widerrufsrecht besteht jedoch nicht bei Waren, die nicht vorgefertigt sind und für deren Herstellung
      eine individuelle Auswahl oder Bestimmung durch den Kunden maßgeblich ist oder die eindeutig auf
      persönliche Bedürfnisse zugeschnitten sind.
    </p>
    <p>
      Dies betrifft insbesondere personalisierte Druckerzeugnisse, individuell gestaltete Schilder,
      Folien, Beschriftungen, Werbeartikel, Sonderanfertigungen und kundenspezifische Designs.
    </p>
  </div>

  <div class="section">
    <h2>§ 15 Reklamationen und Gewährleistung</h2>
    <p>
      Es gelten die gesetzlichen Gewährleistungsrechte, soweit diese AGB keine zulässigen abweichenden
      Regelungen enthalten.
    </p>
    <p>
      Offensichtliche Mängel sind unverzüglich nach Erhalt der Ware oder Leistung mitzuteilen.
      Unternehmer müssen offensichtliche Mängel spätestens innerhalb von sieben Tagen anzeigen.
    </p>
    <p>
      Keine Mängel sind branchenübliche oder technisch bedingte Abweichungen gemäß § 10.
    </p>
  </div>

  <div class="section">
    <h2>§ 16 Haftung</h2>
    <p>
      Caro Bara Smart Print haftet uneingeschränkt bei Vorsatz, grober Fahrlässigkeit sowie bei Verletzung
      von Leben, Körper oder Gesundheit.
    </p>
    <p>
      Bei leichter Fahrlässigkeit haftet Caro Bara Smart Print nur bei Verletzung wesentlicher Vertragspflichten.
      Die Haftung ist in diesem Fall auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
    </p>
    <p>
      Eine Haftung für indirekte Schäden, Folgeschäden, entgangenen Gewinn oder Produktionsausfall ist
      ausgeschlossen, soweit gesetzlich zulässig.
    </p>
  </div>

  <div class="section">
    <h2>§ 17 Eigentumsvorbehalt</h2>
    <p>
      Gelieferte Waren bleiben bis zur vollständigen Bezahlung Eigentum von Caro Bara Smart Print.
    </p>
    <p>
      Bei Unternehmern bleibt die Ware bis zur vollständigen Begleichung sämtlicher Forderungen aus der
      Geschäftsbeziehung Eigentum von Caro Bara Smart Print.
    </p>
  </div>

  <div class="section">
    <h2>§ 18 Daten, Archivierung und Auftragsunterlagen</h2>
    <p>
      Caro Bara Smart Print ist nicht verpflichtet, Druckdaten, Entwürfe, Kundendateien oder sonstige
      Auftragsunterlagen dauerhaft zu archivieren.
    </p>
    <p>
      Eine Archivierung erfolgt nur nach gesonderter Vereinbarung. Der Kunde ist verpflichtet,
      eigene Sicherungskopien seiner Daten aufzubewahren.
    </p>
  </div>

  <div class="section">
    <h2>§ 19 Datenschutz</h2>
    <p>
      Personenbezogene Daten werden ausschließlich im Rahmen der gesetzlichen Vorschriften,
      insbesondere der Datenschutz-Grundverordnung (DSGVO), verarbeitet.
    </p>
    <p>
      Die Verarbeitung erfolgt zur Durchführung vorvertraglicher Maßnahmen, zur Vertragserfüllung,
      zur Kommunikation, zur Rechnungsstellung und zur Erfüllung gesetzlicher Pflichten.
    </p>
  </div>

  <div class="section">
    <h2>§ 20 Aufrechnung und Zurückbehaltungsrecht</h2>
    <p>
      Der Kunde ist zur Aufrechnung nur berechtigt, wenn seine Gegenansprüche rechtskräftig festgestellt,
      unbestritten oder von Caro Bara Smart Print anerkannt sind.
    </p>
    <p>
      Ein Zurückbehaltungsrecht besteht nur, soweit es auf demselben Vertragsverhältnis beruht.
    </p>
  </div>

  <div class="section">
    <h2>§ 21 Schlussbestimmungen</h2>
    <p>
      Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
    </p>
    <p>
      Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches
      Sondervermögen, ist Gerichtsstand Berlin, soweit gesetzlich zulässig.
    </p>
    <p>
      Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit
      der übrigen Bestimmungen unberührt.
    </p>
  </div>

  <div class="footer-info">
    Stand: 2026<br/>
    Caro Bara Smart Print · Fanningerstraße 20 · 10365 Berlin · Deutschland<br/>
    info@carobara.com · info@carobara.de · www.carobara.com · www.carobara.de
  </div>

</div>
</body>
</html>`;
}