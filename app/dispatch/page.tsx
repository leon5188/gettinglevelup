import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "We answer the calls you miss",
  description:
    "Done-for-you call answering for plumbing companies. We pick up what you miss, get the name, address and problem, and text it to you. Nothing to log into.",
  openGraph: {
    title: "We answer the calls you miss | Plumbify",
    description:
      "Done-for-you call answering for plumbing companies. Nothing to install, nothing to learn.",
  },
};

const bookingUrl =
  process.env.NEXT_PUBLIC_DISPATCH_BOOKING_URL || "/demo?plan=dispatch";
const lineTestUrl =
  process.env.NEXT_PUBLIC_LINE_TEST_URL || "/demo?plan=dispatch&intent=line-test";

const steps = [
  {
    t: "Your phone rings and you can't get to it.",
    d: "After four rings it comes to us. Your number, your caller ID, your carrier — nothing on your end changes.",
  },
  {
    t: "We answer as your company.",
    d: "Name, address, what's broken, best callback number. Under 90 seconds. No prices quoted, no arrival times promised.",
  },
  {
    t: "You get a text.",
    d: "“Emergency — Katy, water heater flooding, Mike, 713-555-0142.” If it's urgent and you don't reply, we ring your phone until you wake up.",
  },
  {
    t: "The ones you don't reach get followed up.",
    d: "We text them the next day, and again three days later, so a missed call doesn't quietly turn into a lost customer.",
  },
];

const faqs = [
  {
    q: "I already call people back in the morning.",
    a: "For a dripping faucet, that works fine. For water coming through a ceiling, they've called the next guy before you're awake. This is only about that second kind of call.",
  },
  {
    q: "An answering service quoted me less.",
    a: "They take a message. We take the message, wake you up if it's an emergency, chase the ones who don't book, and ask for the review after the job. Different job, different price.",
  },
  {
    q: "Is it a robot? My customers will hate that.",
    a: "It is. Call the demo line and hear it before you decide. Most callers can't tell, and the ones who can still prefer it to voicemail.",
  },
  {
    q: "What if I want out?",
    a: "Turn off forwarding on your phone. Takes ten seconds and doesn't need us. Your number was never ours to begin with.",
  },
];

export default function DispatchPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="px-6 pt-32 pb-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Done-for-you call answering
          </p>
          <h1 className="text-5xl font-black leading-[1.05] tracking-tighter text-slate-900 md:text-7xl">
            You don&apos;t need another app.
            <br />
            You need someone to answer the phone.
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-slate-500">
            We pick up the calls you miss, get the name, the address and the
            problem, and text it to you. You will never log into anything. There
            is nothing for you to learn.
          </p>
          <div className="mt-10">
            <Link
              href={bookingUrl}
              className="inline-block rounded-xl bg-slate-900 px-8 py-4 text-base font-bold text-white transition hover:bg-black"
            >
              Book a 10-minute call
            </Link>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="border-y border-slate-200 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            We called 40 plumbing companies in Houston at 9pm on a Tuesday.
          </h2>
          <p className="mt-6 text-xl text-slate-600">
            31 of them went to voicemail. Nine picked up.
            <br />
            The nine booked the work.
          </p>
          <p className="mt-6 text-lg text-slate-500">
            We&apos;ll call your shop tonight and tell you exactly what your
            customer hears. No charge, no pitch — you can do whatever you want
            with what we find.
          </p>
          <div className="mt-8">
            <Link
              href={lineTestUrl}
              className="inline-block rounded-xl border-2 border-slate-900 px-8 py-4 text-base font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              Test my line tonight
            </Link>
          </div>
        </div>
      </section>

      {/* What happens */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Four things, and none of them are your problem.
          </h2>
          <div className="mt-12 space-y-10">
            {steps.map((s, i) => (
              <div key={s.t} className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-black text-white">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{s.t}</h3>
                  <p className="mt-1.5 leading-relaxed text-slate-500">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-slate-900 px-8 py-14 text-center md:px-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            The guarantee
          </p>
          <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
            Every call answered.
            <br />
            In 15 seconds. 24 / 7 / 365.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
            If we ever let one go to voicemail, that month is free. Call your own
            line at 3am and check — we&apos;d rather you did.
          </p>
        </div>
      </section>

      {/* What he does */}
      <section className="border-t border-slate-200 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Your side of this takes about fifteen minutes. Once.
          </h2>
          <dl className="mt-12 space-y-8">
            <div className="border-l-4 border-blue-600 pl-6">
              <dt className="font-black text-slate-900">Ten minutes</dt>
              <dd className="mt-1 text-slate-500">
                One form: business name, tax ID, address, what you do, where you
                go, and what counts as an emergency to you.
              </dd>
            </div>
            <div className="border-l-4 border-blue-600 pl-6">
              <dt className="font-black text-slate-900">Five minutes</dt>
              <dd className="mt-1 text-slate-500">
                One phone call where we walk you through forwarding your
                unanswered calls to us. It&apos;s a setting on your phone. It
                takes longer to explain than to do, and you can switch it off any
                time.
              </dd>
            </div>
            <div className="border-l-4 border-slate-200 pl-6">
              <dt className="font-black text-slate-900">Then nothing.</dt>
              <dd className="mt-1 text-slate-500">
                No app, no login, no dashboard, no training. You just start
                getting texts.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Price */}
      <section className="border-t border-slate-200 bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            $497 to set it up.
            <br />
            $597 a month after that.
          </h2>
          <div className="mt-8 space-y-4 text-lg text-slate-600">
            <p>
              The setup covers carrier registration for your number — that part
              is paperwork with the phone companies and takes a few days. We do
              it, not you.
            </p>
            <p>
              No contract. Cancel any month. Full refund inside the first 30 days
              if you don&apos;t think it earned its keep.
            </p>
          </div>
          <p className="mt-6 text-sm text-slate-400">
            Text messaging and call minutes are billed at cost — usually $20–60 a
            month depending on your call volume. We don&apos;t mark them up.
          </p>
          <div className="mt-10">
            <Link
              href={bookingUrl}
              className="inline-block rounded-xl bg-slate-900 px-8 py-4 text-base font-bold text-white transition hover:bg-black"
            >
              Book a 10-minute call
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            What you&apos;re probably thinking
          </h2>
          <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((f) => (
              <div key={f.q} className="py-7">
                <h3 className="font-black text-slate-900">{f.q}</h3>
                <p className="mt-2 leading-relaxed text-slate-500">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
            Find out what your line does at 9pm.
          </p>
          <div className="mt-8">
            <Link
              href={lineTestUrl}
              className="inline-block rounded-xl bg-slate-900 px-8 py-4 text-base font-bold text-white transition hover:bg-black"
            >
              Test my line tonight
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
