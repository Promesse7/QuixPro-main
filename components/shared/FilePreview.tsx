export default function FilePreview({ file }: { file: any }) {
  if (!file) return null
  if (file.type?.startsWith('image/')) return <img src={file.url} alt={file.name} className="max-w-xs" />
  return <a href={file.url} download className="underline">Download {file.name}</a>
}
