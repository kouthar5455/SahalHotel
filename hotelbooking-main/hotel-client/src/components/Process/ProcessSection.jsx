import SectionHeading from '../ui/SectionHeading'
import ProcessStep from './ProcessStep'
import { processImage, processSteps } from '../../data/content'

// Static "how it works" section: renders a heading, a list of process steps
// (from static content data), and a supporting image. No props, no state.
export default function ProcessSection() {
  return (
    <section className="bg-cream-2 px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <SectionHeading eyebrow="Our Process" title="A simple, yet effective three step process" />
          <div className="mt-6 flex flex-col">
            {/* Spread each step object (number, title, description) as props onto ProcessStep */}
            {processSteps.map((step) => (
              <ProcessStep key={step.number} {...step} />
            ))}
          </div>
        </div>

        <img
          src={processImage.src}
          alt={processImage.alt}
          className="h-[420px] w-full rounded-[2rem] object-cover lg:h-full"
        />
      </div>
    </section>
  )
}
