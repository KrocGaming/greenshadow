import { useSeo } from '../lib/seo'
import { Button } from '../components/ui'

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'The page you are looking for does not exist.', path: '/404' })
  return (
    <section className="nf">
      <div className="wrap">
        <p className="mono">Error 404</p>
        <h1 className="nf__title">
          Lost the <em>trail.</em>
        </h1>
        <p className="lead lead--light">This page doesn’t exist. Let’s get you back to the harvest.</p>
        <Button to="/">Back to home</Button>
      </div>
    </section>
  )
}
