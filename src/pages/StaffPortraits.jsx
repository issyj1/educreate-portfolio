import Gallery from "../components/Gallery";
import { staffPortraits } from "../data/staffportraits";

export default function staffPortraits() {
  return <Gallery images={staffPortraits} />;
}