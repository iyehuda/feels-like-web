import FeelsLikeLogo from "../assets/feels-like.svg";
import { getSize, Size } from "../utils/sizes";

export default function Logo({ size = "medium" }: { size?: Size }) {
  return <img src={FeelsLikeLogo} alt="Feels Like Logo" style={{ height: getSize(size) }} />;
}
