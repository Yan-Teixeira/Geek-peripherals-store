import { Button } from './Button'
export function Loading() { return <div className="feedback" role="status"><span className="spinner"/> Carregando...</div> }
export function ErrorNotice({ message, retry }: { message: string; retry?: () => void }) {
  return <div className="notice error" role="alert"><p>{message}</p>{retry && <Button variant="secondary" onClick={retry}>Tentar novamente</Button>}</div>
}
