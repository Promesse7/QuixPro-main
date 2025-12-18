export default function Avatar({ src, alt }: { src?: string; alt?: string }) {
  return <img src={src || '/avatar-placeholder.png'} alt={alt || 'avatar'} className="h-8 w-8 rounded-full" />
}
