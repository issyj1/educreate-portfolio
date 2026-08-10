import ThumbnailGrid from "../components/ThumbnailGrid";
import { featuredImages } from "../data/featuredimages";
import { educateImages } from "../data/educateimages";

export default function HomePage() {
  return (
    <main>

      <section className="hero">
        <h2>EDUCREATE</h2>
        <p>
          Creative services for education companies. Explore latest la.
        </p>
      </section>

      <section className="photography">
        <h2>Photography</h2>
        <ThumbnailGrid images={featuredImages} />
      </section>

      <section className="education">
        <h2>Education</h2>
        <ThumbnailGrid images={educateImages} />
      </section>

    </main>
  );
}