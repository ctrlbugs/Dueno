
import { img_path } from '../../environment';


interface Image {
  className?: string;
  src: string;
  alt?: string;
  height?: number;
  width?: number;
  id?:string;
}

const ImageWithBasePath = (props: Image) => {
  const src = props.src ?? "";
  const isAbsolute =
    src.startsWith("data:") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("//") ||
    src.startsWith("blob:");

  const fullSrc = isAbsolute
    ? src
    : `${img_path}${src
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/")}`;

  return (
    <img
      className={props.className}
      src={fullSrc}
      height={props.height}
      alt={props.alt}
      width={props.width}
      id={props.id}
    />
  );
};

export default ImageWithBasePath;
