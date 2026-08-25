import FooterColumn from './FooterColumn'
import Logo from '../ui/Logo'
import { SocialIcon } from '../ui/Icons'
import { footerColumns, contactInfo } from '../../data/content'

// Social network keys used to look up the matching icon in SocialIcon and to build the aria-label.
const socials = ['facebook', 'instagram', 'twitter']

// Site-wide footer: brand blurb, contact details, link columns, and social icons/copyright bar.
export default function Footer() {
  return (
    <footer id="contact" className="bg-forest-dark px-6 pb-8 pt-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-3">
            <Logo textClassName="text-cream" />
            <p className="max-w-xs text-sm text-cream/50">
              Curated hotels, resorts and villas — book your next stay in minutes.
            </p>
            <div className="flex flex-col gap-1 text-sm text-cream/50">
              <span>{contactInfo.address}</span>
              <a href={`tel:${contactInfo.phone}`} className="transition-colors hover:text-cream">
                {contactInfo.phone}
              </a>
              <a href={`mailto:${contactInfo.email}`} className="transition-colors hover:text-cream">
                {contactInfo.email}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {/* Each entry in footerColumns becomes its own link group. */}
            {footerColumns.map((column) => (
              <FooterColumn key={column.title} {...column} />
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse items-center justify-between gap-6 border-t border-cream/10 pt-6 sm:flex-row">
          {/* Copyright year is computed at render time so it stays current. */}
          <span className="text-xs text-cream/40">© {new Date().getFullYear()} Sahal Stay. All rights reserved.</span>
          <div className="flex gap-3">
            {socials.map((name) => (
              <a
                key={name}
                href="#"
                aria-label={name}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-cream/40 hover:text-cream"
              >
                <SocialIcon name={name} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
