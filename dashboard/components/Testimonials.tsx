import { Star, Quote } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export default function Testimonial({ quote, author, role, company }: TestimonialProps) {
  return (
    <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 relative group transition-all hover:bg-white hover:shadow-xl">
      <Quote className="absolute top-6 right-8 text-slate-200 group-hover:text-blue-100 transition-colors" size={48} />
      <div className="flex gap-1 mb-6">
        {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
      </div>
      <p className="text-slate-700 text-lg italic mb-8 relative z-10">"{quote}"</p>
      <div>
        <div className="font-bold text-slate-900">{author}</div>
        <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{role} • {company}</div>
      </div>
    </div>
  );
}

export function TestimonialGrid({ testimonials }: { testimonials: TestimonialProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((t, i) => (
        <Testimonial key={i} {...t} />
      ))}
    </div>
  );
}
