import { TLink } from './Transition'
import { NAV } from './Nav'
import { company, contact } from '../data/company'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <img className="footer__logo" src="/media/brand/logo-light-840.webp" alt="Greenshadow — The best premium quality products" width="420" height="205" loading="lazy" />
          <p className="footer__claim">
            Spices, nuts &amp; masalas —<br />
            <em>from Kerala to global markets.</em>
          </p>
        </div>

        <div className="footer__grid">
          <div>
            <h2 className="footer__h">Visit</h2>
            <address>
              {contact.addressLines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <a className="footer__a" href={contact.mapsHref} target="_blank" rel="noreferrer">
              Open in Maps ↗
            </a>
          </div>
          <div>
            <h2 className="footer__h">Contact</h2>
            <a className="footer__a" href={contact.phoneHref}>
              {contact.phone}
            </a>
            <a className="footer__a" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <span className="footer__muted">
              {contact.person} — {contact.role}
            </span>
          </div>
          <div>
            <h2 className="footer__h">Company</h2>
            <nav aria-label="Footer" className="footer__nav">
              {[{ to: '/', label: 'Home' }, ...NAV, { to: '/contact', label: 'Contact' }].map((n) => (
                <TLink key={n.to} to={n.to} className="footer__a">
                  {n.label}
                </TLink>
              ))}
            </nav>
          </div>
          <div>
            <h2 className="footer__h">Registrations</h2>
            <dl className="footer__reg">
              <div>
                <dt>CIN</dt>
                <dd>{company.cin}</dd>
              </div>
              <div>
                <dt>GSTIN</dt>
                <dd>{company.gstin}</dd>
              </div>
              <div>
                <dt>IEC</dt>
                <dd>{company.iec}</dd>
              </div>
              <div>
                <dt>FSSAI</dt>
                <dd>11325999000928</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="footer__base">
          <span>© {new Date().getFullYear()} {company.name}</span>
          <span>Thiruvananthapuram · Kerala · India</span>
        </div>
      </div>
      <p className="footer__giant" aria-hidden="true">
        GREENSHADOW
      </p>
    </footer>
  )
}
