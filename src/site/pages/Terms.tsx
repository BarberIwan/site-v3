import { Phone } from 'lucide-react';
import { business } from '../data';
import { pages } from '../pages';
import { PageHeader } from '../sections';

// Tekst ongewijzigd overgenomen van de vorige voorwaardenpagina (april 2026).
const terms = [
  {
    title: '1. Definities',
    content: (
      <>
        <p className="mb-4">In deze algemene voorwaarden wordt verstaan onder:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-white">Barber Iwan:</strong> De eenmanszaak gevestigd te Almere, ingeschreven bij de Kamer van Koophandel.</li>
          <li><strong className="text-white">Klant:</strong> De natuurlijke persoon die een overeenkomst aangaat met Barber Iwan.</li>
          <li><strong className="text-white">Dienst:</strong> Het verlenen van kappersdiensten, inclusief maar niet beperkt tot knippen, scheren en trimmen.</li>
        </ul>
      </>
    ),
  },
  {
    title: '2. Toepasselijkheid',
    content: (
      <>
        <p className="mb-4">
          Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, overeenkomsten en leveringen van Barber Iwan, tenzij uitdrukkelijk anders schriftelijk overeengekomen.
        </p>
        <p>
          Door het maken van een afspraak of het gebruikmaken van onze diensten, accepteert de klant deze algemene voorwaarden.
        </p>
      </>
    ),
  },
  {
    title: '3. Afspraken & Annulering',
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Afspraken kunnen online of telefonisch worden gemaakt.</li>
        <li>Annulering dient minimaal 24 uur van tevoren te worden doorgegeven.</li>
        <li>Bij niet tijdig annuleren behoudt Barber Iwan zich het recht voor om kosten in rekening te brengen.</li>
        <li>Barber Iwan behoudt zich het recht voor om afspraken te verplaatsen bij ziekte of overmacht.</li>
      </ul>
    ),
  },
  {
    title: '4. Betaling',
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Betaling geschiedt contant of per pin direct na de behandeling.</li>
        <li>Prijzen zijn inclusief BTW en onder voorbehoud van wijzigingen.</li>
        <li>Acties en kortingen zijn niet cumuleerbaar, tenzij anders vermeld.</li>
      </ul>
    ),
  },
  {
    title: '5. Klachten',
    content: (
      <p>
        Klachten over de geleverde dienst dienen binnen 7 dagen na de behandeling schriftelijk of per e-mail te worden gemeld. Barber Iwan zal binnen 14 dagen reageren en een passende oplossing bieden.
      </p>
    ),
  },
  {
    title: '6. Aansprakelijkheid',
    content: (
      <>
        <p className="mb-4">Barber Iwan is niet aansprakelijk voor schade die het gevolg is van:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Onjuiste informatie verstrekt door de klant.</li>
          <li>Allergieën of huidaandoeningen die niet vooraf zijn gemeld.</li>
          <li>Omstandigheden buiten de invloedssfeer van Barber Iwan.</li>
        </ul>
      </>
    ),
  },
  {
    title: '7. Privacy & Gegevensbescherming',
    content: (
      <p>
        Barber Iwan respecteert de privacy van klanten. Persoonsgegevens worden uitsluitend gebruikt voor het maken van afspraken en worden niet gedeeld met derden. Klanten hebben recht op inzage, correctie en verwijdering van hun gegevens.
      </p>
    ),
  },
  {
    title: '8. Intellectueel Eigendom',
    content: (
      <p>
        Alle foto's en content op de website en social media van Barber Iwan zijn eigendom van Barber Iwan en mogen niet zonder toestemming worden gebruikt.
      </p>
    ),
  },
  {
    title: '9. Wijzigingen',
    content: (
      <p>
        Barber Iwan behoudt zich het recht voor om deze algemene voorwaarden te wijzigen. De meest recente versie is altijd beschikbaar op de website.
      </p>
    ),
  },
  {
    title: '10. Toepasselijk Recht',
    content: (
      <p>
        Op alle overeenkomsten is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement waar Barber Iwan is gevestigd.
      </p>
    ),
  },
];

export function Terms() {
  return (
    <>
      <PageHeader
        page={pages.voorwaarden}
        eyebrow="Juridisch"
        title={
          <>
            Algemene <span className="italic text-gold">voorwaarden</span>
          </>
        }
        intro={<p>De onderstaande voorwaarden zijn van toepassing op alle diensten van Barber Iwan.</p>}
      />
      <section className="pb-24 relative">
        <div className="max-w-4xl mx-auto px-8">
          <div className="space-y-12">
            {terms.map((term) => (
              <div key={term.title} className="border-l-2 border-gold/30 pl-8 hover:border-gold/60 transition-colors">
                <h2 className="font-serif text-2xl md:text-3xl text-white mb-4">{term.title}</h2>
                <div className="text-white/70 leading-relaxed">{term.content}</div>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-white/10 text-center">
            <h2 className="font-serif text-2xl mb-4">Vragen?</h2>
            <p className="text-white/60 mb-6">Neem gerust contact op als je vragen hebt over deze voorwaarden.</p>
            <a href={business.phone.href} className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors">
              <Phone className="w-5 h-5" aria-hidden="true" />
              {business.phone.plain}
            </a>
            <p className="text-white/30 text-xs mt-8">Versie: april 2026</p>
          </div>
        </div>
      </section>
    </>
  );
}
