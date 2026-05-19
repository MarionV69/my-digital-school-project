import arbreBg from '@/assets/images/arbre.jpg';
import { Badge } from '../ui/badge';

export default function HowItWorksHeader() {

    return(
        <section className="relative bg-cover bg-center min-h-120 px-4 py-8 lg:py-12 lg:px-24" style={{ backgroundImage: `url(${arbreBg})` }}>
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center">
                <div className="relative z-10 px-4 py-8 lg:py-12 lg:px-24 flex flex-col items-center gap-2">
                    <Badge className='bg-white/10 backdrop-blur-md text-white border-1 border-white/20 p-4'>Le Bon Fournisseur</Badge>
                    <h1 className='text-white max-w-4/12 text-center'>Simple, direct, sans intermédiaire.</h1>
                    <p className='text-white/90 max-w-3/12 text-center'>Producteurs locaux vérifiés. Fiches, tarifs, messagerie. Direct.</p>
                </div>
            </div>
        </section>
    )
}