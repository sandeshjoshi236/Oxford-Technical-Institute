import { useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowDown, ArrowUpRight, BookOpen, Building2, Check, ChevronLeft, ChevronRight, Clock3, Code2, Cpu, Instagram, Layers3, Lightbulb, Mail, MapPin, Menu, Monitor, Phone, Play, RotateCcw, Send, Star, Users, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import instituteLogo from '@assets/logo_1790399971522.png';
import learningRoomPhoto from '@assets/dd_1790399614772.png';
import studentsPhoto from '@assets/yy_1790399620879.png';
import institutePhoto from '@assets/o_1790399626715.png';

const queryClient = new QueryClient();

type IconType = typeof Code2;
type Course = { title: string; summary: string; level: string; duration: string; icon: IconType; tag: string; editable?: boolean };

const courses: Course[] = [
  { title: 'Computer Fundamentals', summary: 'A practical start with the tools, habits, and confidence needed for everyday digital work.', level: 'Starter', duration: 'Editable duration', icon: Monitor, tag: 'First steps' },
  { title: 'Web Design & Development', summary: 'Turn ideas into responsive web pages while learning the thinking behind the screen.', level: 'Building', duration: 'Editable duration', icon: Code2, tag: 'Make things' },
  { title: 'Graphic Design', summary: 'Explore visual communication through layouts, type, colour, and a hands-on creative process.', level: 'Building', duration: 'Editable duration', icon: Layers3, tag: 'See differently' },
  { title: 'Office Productivity', summary: 'Build useful confidence in the digital tools that help school, work, and daily life move forward.', level: 'Starter', duration: 'Editable duration', icon: BookOpen, tag: 'Work smarter' },
];

const quizQuestions = [
  { question: 'Which part of a computer is often called its “brain”?', choices: ['Monitor', 'CPU', 'Keyboard', 'Printer'], answer: 'CPU', hint: 'It processes instructions.' },
  { question: 'What does HTML primarily help you do?', choices: ['Structure a web page', 'Charge a laptop', 'Edit a photograph', 'Connect to Wi-Fi'], answer: 'Structure a web page', hint: 'Think of headings, links, and sections.' },
  { question: 'Which is the strongest password?', choices: ['kathmandu123', 'password', 'Mango!River7#', '12345678'], answer: 'Mango!River7#', hint: 'Mix length, symbols, and words.' },
  { question: 'What does “save” do in a document?', choices: ['Make the screen brighter', 'Keep your latest changes', 'Open a new browser tab', 'Remove the keyboard'], answer: 'Keep your latest changes', hint: 'It protects your work for later.' },
  { question: 'A browser is used to…', choices: ['Visit websites', 'Print a keyboard', 'Clean a screen', 'Build a desk'], answer: 'Visit websites', hint: 'You may be using one right now.' },
];

const facilities = [
  { title: 'The learning room', note: 'Oxford Technical Institute · Kathmandu', image: learningRoomPhoto, color: 'from-[#0f2c56] to-[#146c9a]', mark: '01' },
  { title: 'Hands-on practice', note: 'Students learning together', image: studentsPhoto, color: 'from-[#124b75] to-[#1fb7d2]', mark: '02' },
  { title: 'A place to ask', note: 'The Oxford Technical Institute entrance', image: institutePhoto, color: 'from-[#0a315c] to-[#19779f]', mark: '03' },
];

const reviews = [
  'Best Institute in technical field.',
  'Totally satisfied with faculty.',
  'One of the best institution in Kathmandu.',
  'Best Place for Professional Computer Training.',
];

const navItems = [
  { label: 'Home', id: 'top' },
  { label: 'About', id: 'about' },
  { label: 'Courses', id: 'courses' },
  { label: 'Why Us', id: 'why-us' },
  { label: 'Facilities', id: 'facilities' },
  { label: 'Reviews', id: 'reviews' },
  { label: 'Gallery', id: 'gallery' },
  { label: 'Contact', id: 'contact' },
];

function App() {
  useEffect(() => {
    document.title = 'Oxford Technical Institute | Build your digital future';
    const description = 'Practical computer and technology education in Kathmandu for students and parents ready to take the next step.';
    const setMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let node = document.querySelector(selector);
      if (!node) { node = document.createElement('meta'); node.setAttribute(property ? 'property' : 'name', name); document.head.appendChild(node); }
      node.setAttribute('content', content);
    };
    setMeta('description', description);
    setMeta('og:title', 'Oxford Technical Institute | Build your digital future', true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState('All');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [faq, setFaq] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', interest: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    if (!finePointer.matches) return;
    const moveCursorGlow = (event: PointerEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
    };
    window.addEventListener('pointermove', moveCursorGlow);
    return () => window.removeEventListener('pointermove', moveCursorGlow);
  }, []);

  const categories = ['All', 'Starter', 'Building'];
  const filteredCourses = useMemo(() => activeCourse === 'All' ? courses : courses.filter((course) => course.level === activeCourse), [activeCourse]);
  const currentQuestion = quizQuestions[quizIndex];
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };
  const submitAnswer = () => {
    if (!selected) return;
    if (selected === currentQuestion.answer) setScore((value) => value + 1);
    if (quizIndex === quizQuestions.length - 1) setQuizDone(true);
    else { setQuizIndex((value) => value + 1); setSelected(''); }
  };
  const restartQuiz = () => { setQuizIndex(0); setSelected(''); setScore(0); setQuizDone(false); setQuizStarted(true); };
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Please add your name.';
    if (!/^\d{7,15}$/.test(form.phone.replace(/\s/g, ''))) errors.phone = 'Enter a valid phone number.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Check your email address.';
    if (!form.interest) errors.interest = 'Choose an area of interest.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = (event: React.FormEvent) => { event.preventDefault(); if (validateForm()) setSubmitted(true); };
  const updateForm = (key: keyof typeof form, value: string) => { setForm((current) => ({ ...current, [key]: value })); setFormErrors((current) => ({ ...current, [key]: '' })); };

  return (
    <div className="oti-page noise">
      {isLoading && <div className="loading-screen" role="status" aria-label="Loading Oxford Technical Institute"><img src={instituteLogo} alt="Oxford Technical Institute logo" className="loading-logo" /><div className="loading-name">Oxford Technical Institute</div><div className="loading-line"><span /></div></div>}
      <header className="fixed top-0 z-40 w-full border-b border-white/10 bg-[#101f31]/90 text-[#f6f2e9] backdrop-blur-md">
        <div className="container-wide flex h-[76px] items-center justify-between">
          <button onClick={() => scrollTo('top')} className="flex items-center gap-3 text-left" data-testid="button-brand">
            <img src={instituteLogo} alt="Oxford Technical Institute logo" className="brand-logo h-10 w-10 rounded-full object-cover" />
            <span><span className="block text-[13px] font-extrabold tracking-[.18em]">OXFORD</span><span className="block font-mono-custom text-[9px] tracking-[.2em] text-[#eeb04a]">TECHNICAL INSTITUTE</span></span>
          </button>
          <nav className="hidden items-center gap-5 text-[11px] font-semibold xl:flex" aria-label="Main navigation">
            {navItems.map((item) => <button key={item.id} onClick={() => scrollTo(item.id)} className="nav-link text-[#e9e6de]/75 hover:text-[#f6f2e9]" data-testid={`link-nav-${item.id}`}>{item.label}</button>)}
          </nav>
          <div className="hidden items-center gap-5 md:flex"><a href="tel:9851311567" className="text-xs text-[#e9e6de]/70 hover:text-[#eeb04a]" data-testid="link-phone-header">9851311567</a><button onClick={() => scrollTo('contact')} className="button-primary !min-h-[40px] !px-4 !text-[11px]" data-testid="button-header-inquiry">Make an inquiry <ArrowUpRight size={14} /></button></div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 lg:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="border-t border-white/10 bg-[#101f31] px-6 py-5 lg:hidden">{navItems.map((item) => <button key={item.id} onClick={() => scrollTo(item.id)} className="block w-full border-b border-white/10 py-4 text-left text-sm" data-testid={`link-mobile-${item.id}`}>{item.label}</button>)}</div>}
      </header>

      <main id="top">
        <section className="relative flex min-h-[760px] items-end bg-[#101f31] pb-20 pt-36 text-[#f6f2e9] md:min-h-[850px] md:pb-28">
          <div className="hero-grid absolute inset-0 opacity-70" /><div className="hero-image absolute inset-0 opacity-70" />
          <div className="container-wide relative z-10 grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <div className="max-w-[720px]">
              <div className="reveal mb-7 flex items-center gap-3"><span className="h-px w-9 bg-[#eeb04a]" /><span className="eyebrow eyebrow-light">Kathmandu · Practical technology education</span></div>
              <h1 className="reveal reveal-delay-1 max-w-[850px] font-display text-[clamp(3.5rem,8.2vw,8.6rem)] leading-[.89] tracking-[-.06em]">Make room<br />for your <span className="serif-italic text-[#eeb04a]">future.</span></h1>
              <p className="reveal reveal-delay-2 mt-8 max-w-[500px] text-base leading-7 text-[#f6f2e9]/75 md:text-lg">Practical computer and technology education for people ready to move from “I wish I could” to “I made this.”</p>
              <div className="reveal reveal-delay-3 mt-9 flex flex-wrap gap-3"><button onClick={() => scrollTo('courses')} className="button-primary" data-testid="button-hero-courses">Explore courses <ArrowDown size={16} /></button><button onClick={() => scrollTo('challenge')} className="button-ghost button-light" data-testid="button-hero-challenge"><Play size={15} fill="currentColor" /> Try the Tech Challenge</button></div>
            </div>
            <div className="hidden justify-end lg:flex"><div className="w-[240px] border-l border-[#f6f2e9]/30 pl-5 text-sm text-[#f6f2e9]/70"><span className="eyebrow eyebrow-light">Find us here</span><p className="mt-3 leading-6">3, 32 Muni Bhairab Marg<br />Kathmandu, Nepal</p><a className="mt-5 inline-flex items-center gap-2 text-[#eeb04a] hover:underline" href="tel:9851311567" data-testid="link-hero-phone"><Phone size={14} /> 9851311567</a></div></div>
          </div>
          <div className="absolute bottom-6 left-0 right-0"><div className="container-wide flex items-center justify-between font-mono-custom text-[9px] tracking-[.14em] text-[#f6f2e9]/50"><span>01 / 06 — START HERE</span><span className="hidden md:block">SCROLL TO EXPLORE <ArrowDown className="ml-2 inline" size={13} /></span></div></div>
        </section>

        <div className="overflow-hidden border-b border-[#d8d0c2] bg-[#e8dfcf] py-4 text-[#193b42]"><div className="marquee-track flex w-max gap-9 font-mono-custom text-[10px] tracking-[.18em]"><span>LEARN BY DOING</span><span>•</span><span>BUILD DIGITAL CONFIDENCE</span><span>•</span><span>KATHMANDU, NEPAL</span><span>•</span><span>LEARN BY DOING</span><span>•</span><span>BUILD DIGITAL CONFIDENCE</span><span>•</span><span>KATHMANDU, NEPAL</span><span>•</span></div></div>

        <section id="about" className="section-pad bg-[#f6f2e9]"><div className="container-wide grid gap-14 lg:grid-cols-[.8fr_1.2fr]"><div><span className="eyebrow">Why Oxford</span><div className="mt-5 flex items-center gap-4"><span className="font-display text-7xl text-[#193b42]">01</span><span className="h-px w-20 bg-[#eeb04a]" /></div></div><div><h2 className="section-title max-w-[730px] text-[#193b42]">Technology feels different when someone helps you <span className="serif-italic text-[#b76a3c]">see yourself in it.</span></h2><p className="mt-7 max-w-[620px] text-base leading-8 text-[#5b5b58]">Oxford Technical Institute is a place to ask beginner questions without shrinking, practise until it clicks, and build the practical skills that make a digital future feel possible. We focus on computer and technology education, with a human pace.</p><div className="mt-10 grid max-w-[620px] gap-4 sm:grid-cols-3"><div className="border-t border-[#cfc6b7] pt-4"><strong className="font-display text-3xl text-[#193b42]">5.0</strong><p className="mt-1 text-xs text-[#66615b]">Google rating</p></div><div className="border-t border-[#cfc6b7] pt-4"><strong className="font-display text-3xl text-[#193b42]">10</strong><p className="mt-1 text-xs text-[#66615b]">Google reviews</p></div><div className="border-t border-[#cfc6b7] pt-4"><strong className="font-display text-3xl text-[#193b42]">01</strong><p className="mt-1 text-xs text-[#66615b]">Clear next step</p></div></div></div></div></section>

        <section id="courses" className="section-pad bg-[#e8dfcf]"><div className="container-wide"><div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><span className="eyebrow">The learning menu</span><h2 className="section-title mt-5 max-w-[630px] text-[#193b42]">Start with what<br /><span className="serif-italic text-[#b76a3c]">pulls you in.</span></h2></div><div className="flex gap-2" role="tablist" aria-label="Course level filters">{categories.map((category) => <button key={category} onClick={() => setActiveCourse(category)} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${activeCourse === category ? 'border-[#193b42] bg-[#193b42] text-[#f6f2e9]' : 'border-[#bdb3a3] text-[#5b5b58] hover:border-[#193b42]'}`} data-testid={`button-course-filter-${category.toLowerCase()}`}>{category}</button>)}</div></div><div className="mt-12 grid gap-4 md:grid-cols-2">{filteredCourses.map((course, index) => { const Icon = course.icon; return <article key={course.title} className="course-card group relative flex min-h-[275px] flex-col justify-between overflow-hidden rounded-2xl border border-[#d2c8b8] bg-[#f6f2e9] p-7" data-testid={`card-course-${index}`}><div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#193b42] text-[#eeb04a]"><Icon size={21} /></span><span className="font-mono-custom text-[10px] text-[#8b847b]">0{index + 1}</span></div><div><div className="mb-3 flex items-center gap-2"><span className="rounded-full bg-[#e8dfcf] px-2 py-1 font-mono-custom text-[9px] uppercase tracking-wider text-[#5f5a52]">{course.level}</span><span className="text-[10px] text-[#8b847b]">{course.duration}</span></div><h3 className="font-display text-3xl leading-none text-[#193b42]">{course.title}</h3><p className="mt-3 max-w-[400px] text-sm leading-6 text-[#68635b]">{course.summary}</p><button type="button" onClick={() => scrollTo('contact')} className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#b76a3c] hover:text-[#193b42]" data-testid={`button-view-course-${index}`}>View course <ArrowUpRight size={14} /></button></div><span className="absolute right-7 top-7 opacity-0 transition group-hover:opacity-100"><ArrowUpRight className="text-[#b76a3c]" /></span></article>; })}</div><div className="mt-6 flex items-center gap-2 text-xs text-[#756e65]"><Lightbulb size={15} className="text-[#b76a3c]" /> Course names, durations, and details are editable placeholders until confirmed by the institute.</div></div></section>

        <section id="challenge" className="section-pad bg-[#193b42] text-[#f6f2e9]"><div className="container-wide grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><span className="eyebrow eyebrow-light">A five-minute warm-up</span><h2 className="section-title mt-5 max-w-[500px]">How tech-curious<br />are <span className="serif-italic text-[#eeb04a]">you?</span></h2><p className="mt-6 max-w-[390px] text-sm leading-7 text-[#d8dfd9]/75">No grades. No pressure. Just five beginner questions to get your brain switched on.</p><div className="mt-7 flex items-center gap-3 font-mono-custom text-[10px] text-[#d8dfd9]/60"><span className="h-2 w-2 rounded-full bg-[#eeb04a]" /> Beginner-friendly · instant result</div></div><div className="rounded-2xl bg-[#f6f2e9] p-5 text-[#193b42] shadow-2xl md:p-8">{!quizStarted ? <div className="flex min-h-[345px] flex-col justify-between"><div><div className="flex justify-between"><span className="eyebrow">Tech challenge</span><span className="font-mono-custom text-xs text-[#8b847b]">5 questions</span></div><div className="mt-10 max-w-[460px]"><h3 className="font-display text-4xl leading-none md:text-5xl">A little quiz can open a big door.</h3><p className="mt-5 text-sm leading-6 text-[#68635b]">Test your instincts, learn something new, and leave with a reason to keep going.</p></div></div><button onClick={() => setQuizStarted(true)} className="button-primary button-dark mt-8 self-start" data-testid="button-start-quiz">Start the challenge <ArrowUpRight size={16} /></button></div> : quizDone ? <div className="flex min-h-[345px] flex-col justify-between"><div><span className="eyebrow">Your result</span><div className="mt-8 flex items-end gap-3"><span className="font-display text-8xl leading-none text-[#b76a3c]">{score}</span><span className="mb-2 font-mono-custom text-sm text-[#68635b]">/ 5 correct</span></div><h3 className="mt-5 font-display text-3xl text-[#193b42]">{score >= 4 ? 'You have a strong starting instinct.' : score >= 2 ? 'You are already asking the right questions.' : 'Every expert starts with a first click.'}</h3><p className="mt-3 max-w-[440px] text-sm leading-6 text-[#68635b]">Keep exploring. Practical learning is built one small win at a time.</p></div><button onClick={restartQuiz} className="button-ghost button-dark mt-8 self-start" data-testid="button-replay-quiz"><RotateCcw size={15} /> Play again</button></div> : <div><div className="flex items-center justify-between"><span className="eyebrow">Question {quizIndex + 1} of 5</span><span className="font-mono-custom text-xs text-[#8b847b]">{score} correct</span></div><div className="mt-4 h-1 overflow-hidden rounded-full bg-[#e8dfcf]"><div className="h-full bg-[#eeb04a] transition-all" style={{ width: `${((quizIndex + 1) / 5) * 100}%` }} /></div><h3 className="mt-9 max-w-[540px] font-display text-3xl leading-tight text-[#193b42] md:text-4xl">{currentQuestion.question}</h3><div className="mt-6 grid gap-2 sm:grid-cols-2">{currentQuestion.choices.map((choice, index) => <button key={choice} onClick={() => setSelected(choice)} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${selected === choice ? 'border-[#193b42] bg-[#193b42] text-[#f6f2e9]' : 'border-[#d2c8b8] hover:border-[#193b42]'}`} data-testid={`button-quiz-choice-${index}`}><span className={`flex h-6 w-6 items-center justify-center rounded-full font-mono-custom text-[10px] ${selected === choice ? 'bg-[#eeb04a] text-[#193b42]' : 'bg-[#e8dfcf] text-[#68635b]'}`}>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div><div className="mt-5 flex items-center justify-between gap-4"><span className="text-xs text-[#8b847b]">{selected ? currentQuestion.hint : 'Choose one to continue.'}</span><button onClick={submitAnswer} disabled={!selected} className="button-primary button-dark !min-h-[42px] disabled:cursor-not-allowed disabled:opacity-40" data-testid="button-next-question">{quizIndex === 4 ? 'See result' : 'Next'} <ChevronRight size={15} /></button></div></div>}</div></div></section>

        <section id="why-us" className="section-pad bg-[#f6f2e9]"><div className="container-wide"><div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]"><div><span className="eyebrow">The Oxford difference</span><h2 className="section-title mt-5 max-w-[500px] text-[#193b42]">A calm place to get <span className="serif-italic text-[#b76a3c]">unstuck.</span></h2></div><div className="divide-y divide-[#d8d0c2]">{[{ icon: Users, title: 'Human, not intimidating', copy: 'Questions are part of learning here. Start exactly where you are.' }, { icon: Code2, title: 'Practical by design', copy: 'Learn through the tools and tasks you actually want to use.' }, { icon: Clock3, title: 'Progress at your pace', copy: 'Build confidence through repeatable, tangible small wins.' }, { icon: Building2, title: 'Right here in Kathmandu', copy: 'Find your next step at 3, 32 Muni Bhairab Marg, Kathmandu, Nepal.' }].map(({ icon: Icon, title, copy }, index) => <div key={title} className="flex gap-5 py-6"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e8dfcf] text-[#193b42]"><Icon size={18} /></span><div><h3 className="font-display text-2xl text-[#193b42]">{title}</h3><p className="mt-2 max-w-[460px] text-sm leading-6 text-[#68635b]">{copy}</p></div><span className="ml-auto font-mono-custom text-[10px] text-[#aaa195]">0{index + 1}</span></div>)}</div></div></div></section>

        <section id="facilities" className="section-pad bg-[#e8dfcf]"><div className="container-wide"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><span className="eyebrow">A space to imagine</span><h2 className="section-title mt-5 text-[#193b42]">See yourself <span className="serif-italic text-[#b76a3c]">learning.</span></h2></div><span className="max-w-[250px] text-xs leading-5 text-[#756e65]">A look inside Oxford Technical Institute, shared by the institute.</span></div><div id="gallery" className="mt-12 grid gap-4 md:grid-cols-3">{facilities.map((facility, index) => <button key={facility.title} onClick={() => setLightbox(index)} className={`facility-card group relative min-h-[330px] overflow-hidden rounded-2xl bg-gradient-to-br ${facility.color} p-6 text-left text-[#f6f2e9]`} data-testid={`button-gallery-${index}`}><img src={facility.image} alt={facility.title} className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#071a33]/90 via-[#071a33]/15 to-transparent" /><div className="relative flex h-full flex-col justify-between"><div className="flex items-center justify-between"><span className="eyebrow eyebrow-light">Institute photo</span><span className="font-mono-custom text-xs">{facility.mark}</span></div><div><h3 className="font-display text-3xl">{facility.title}</h3><p className="mt-2 text-xs text-[#f6f2e9]/80">{facility.note}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#eeb04a]">Open preview <ArrowUpRight size={14} /></span></div></div></button>)}</div></div></section>

        {lightbox !== null && <div className="lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center bg-[#101f31]/90 p-5" role="dialog" aria-modal="true" aria-label="Gallery preview"><button onClick={() => setLightbox(null)} className="absolute right-5 top-5 rounded-full border border-white/20 p-3 text-white hover:bg-white/10" aria-label="Close gallery" data-testid="button-close-lightbox"><X size={20} /></button><div className={`relative flex min-h-[420px] w-full max-w-[760px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${facilities[lightbox].color} p-7 text-[#f6f2e9] md:min-h-[520px]`}><img src={facilities[lightbox].image} alt={facilities[lightbox].title} className="absolute inset-0 h-full w-full object-cover opacity-65" /><div className="absolute inset-0 bg-gradient-to-t from-[#071a33] via-[#071a33]/50 to-transparent" /><div className="relative flex h-full min-h-[370px] flex-col justify-between md:min-h-[470px]"><span className="eyebrow eyebrow-light">Gallery preview · {facilities[lightbox].mark}</span><div><h2 className="font-display text-5xl">{facilities[lightbox].title}</h2><p className="mt-3 max-w-[360px] text-sm text-white/80">{facilities[lightbox].note}</p></div><div className="flex justify-between"><button onClick={() => setLightbox((lightbox + facilities.length - 1) % facilities.length)} className="button-ghost button-light" data-testid="button-gallery-previous"><ChevronLeft size={16} /> Previous</button><button onClick={() => setLightbox((lightbox + 1) % facilities.length)} className="button-ghost button-light" data-testid="button-gallery-next">Next <ChevronRight size={16} /></button></div></div></div></div>}

        <section className="section-pad bg-[#f6f2e9]"><div className="container-wide grid gap-14 lg:grid-cols-[1fr_.75fr]"><div><span className="eyebrow">From curious to capable</span><h2 className="section-title mt-5 max-w-[630px] text-[#193b42]">Your next chapter has a <span className="serif-italic text-[#b76a3c]">shape.</span></h2><div className="mt-12 space-y-0">{['Tell us what you want to learn.', 'Find the right starting point.', 'Practise with support.', 'Leave with something you can use.'].map((step, index) => <div key={step} className="flex items-center gap-5 border-b border-[#d8d0c2] py-5"><span className="font-mono-custom text-xs text-[#b76a3c]">0{index + 1}</span><span className="font-display text-2xl text-[#193b42]">{step}</span><Check size={17} className="ml-auto text-[#2f766d]" /></div>)}</div></div><div className="rounded-2xl bg-[#193b42] p-7 text-[#f6f2e9] md:p-9"><span className="eyebrow eyebrow-light">A simple beginning</span><p className="mt-10 font-display text-4xl leading-tight">“I do not need to know everything. I just need a place to start.”</p><div className="mt-10 border-t border-white/20 pt-5 text-xs leading-5 text-white/60">That is what the first conversation is for. No pressure, just a useful next step.</div></div></div></section>

        <section id="reviews" className="bg-[#e8dfcf] py-20"><div className="container-wide"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><span className="eyebrow">The local signal</span><h2 className="mt-4 font-display text-5xl text-[#193b42]">5.0 <span className="font-mono-custom text-sm tracking-[.12em] text-[#b76a3c]">/ 5</span></h2><p className="mt-3 text-sm text-[#68635b]">Google rating · 10 reviews</p></div><p className="max-w-[420px] border-l border-[#cfc6b7] pl-6 text-sm leading-7 text-[#68635b] md:pl-10">A few words shared by Oxford Technical Institute reviewers. Names and dates are not shown because they were not provided.</p></div><div className="mt-12 grid gap-4 md:grid-cols-2">{reviews.map((review, index) => <article key={review} className="rounded-2xl border border-[#cfc6b7] bg-[#f6f2e9] p-6 md:p-8" data-testid={`card-review-${index}`}><div className="flex items-center gap-1 text-[#eeb04a]" aria-label="5 star review">{Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} size={15} fill="currentColor" />)}</div><p className="mt-6 font-display text-2xl leading-tight text-[#193b42]">“{review}”</p><p className="mt-6 font-mono-custom text-[10px] uppercase tracking-[.16em] text-[#756e65]">Google review</p></article>)}</div></div></section>

        <section id="contact" className="section-pad bg-[#f6f2e9]"><div className="container-wide grid gap-14 lg:grid-cols-[.82fr_1.18fr]"><div><span className="eyebrow">Your next move</span><h2 className="section-title mt-5 max-w-[560px] text-[#193b42]">Ask a real question. <span className="serif-italic text-[#b76a3c]">Start there.</span></h2><p className="mt-6 max-w-[380px] text-sm leading-7 text-[#68635b]">Tell us what you are curious about. We will use your inquiry to help you find a sensible place to begin.</p><div className="mt-9 space-y-4 text-sm text-[#5e5a53]"><a href="tel:9851311567" className="flex items-center gap-3 hover:text-[#193b42]" data-testid="link-contact-phone"><Phone size={16} className="text-[#b76a3c]" /> 9851311567</a><div className="flex items-start gap-3"><MapPin size={16} className="mt-1 text-[#b76a3c]" /><span>3, 32 Muni Bhairab Marg<br />Kathmandu, Nepal</span></div><div className="flex items-center gap-3"><Mail size={16} className="text-[#b76a3c]" /> Inquiry form below</div></div><div className="relative mt-8 h-44 overflow-hidden rounded-2xl border border-[#d2c8b8] bg-[#e8dfcf] p-4" data-testid="map-placeholder"><div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(30deg, transparent 47%, #bdb3a3 48%, #bdb3a3 49%, transparent 50%), linear-gradient(120deg, transparent 46%, #c7bdad 47%, #c7bdad 48%, transparent 49%)', backgroundSize: '76px 58px' }} /><div className="relative flex h-full items-center justify-center"><div className="flex flex-col items-center"><MapPin size={27} className="text-[#b76a3c]" fill="currentColor" /><span className="mt-2 rounded-full bg-[#193b42] px-3 py-1 font-mono-custom text-[9px] text-[#f6f2e9]">MAP PLACEHOLDER</span></div></div><span className="absolute bottom-3 left-4 font-mono-custom text-[9px] text-[#756e65]">Replace with approved map embed</span></div></div><div>{submitted ? <div className="flex min-h-[450px] flex-col justify-center rounded-2xl bg-[#193b42] p-8 text-[#f6f2e9] md:p-12"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eeb04a] text-[#193b42]"><Check /></span><h3 className="mt-8 font-display text-5xl">We have your note.</h3><p className="mt-4 max-w-[420px] text-sm leading-6 text-white/70">Thank you, {form.name}. The institute can follow up using the details you shared.</p><button onClick={() => setSubmitted(false)} className="button-ghost button-light mt-8 self-start" data-testid="button-edit-inquiry">Edit inquiry</button></div> : <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-[#d8d0c2] bg-[#efe9de] p-6 md:p-9"><div className="grid gap-5 md:grid-cols-2"><label className="text-xs font-bold text-[#4f4b45]">Your name<input value={form.name} onChange={(e) => updateForm('name', e.target.value)} className={`field mt-2 ${formErrors.name ? 'error' : ''}`} placeholder="How should we call you?" data-testid="input-name" />{formErrors.name && <span className="mt-1 block text-xs text-[#b13e32]">{formErrors.name}</span>}</label><label className="text-xs font-bold text-[#4f4b45]">Phone number<input value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} className={`field mt-2 ${formErrors.phone ? 'error' : ''}`} placeholder="985..." inputMode="tel" data-testid="input-phone" />{formErrors.phone && <span className="mt-1 block text-xs text-[#b13e32]">{formErrors.phone}</span>}</label></div><label className="mt-5 block text-xs font-bold text-[#4f4b45]">Email <span className="font-normal text-[#8b847b]">(optional)</span><input value={form.email} onChange={(e) => updateForm('email', e.target.value)} className={`field mt-2 ${formErrors.email ? 'error' : ''}`} placeholder="you@example.com" type="email" data-testid="input-email" />{formErrors.email && <span className="mt-1 block text-xs text-[#b13e32]">{formErrors.email}</span>}</label><label className="mt-5 block text-xs font-bold text-[#4f4b45]">I am interested in<select value={form.interest} onChange={(e) => updateForm('interest', e.target.value)} className={`field mt-2 ${formErrors.interest ? 'error' : ''}`} data-testid="select-interest"><option value="">Choose a starting point</option><option>Computer Fundamentals</option><option>Web Design & Development</option><option>Graphic Design</option><option>Office Productivity</option><option>Something else</option></select>{formErrors.interest && <span className="mt-1 block text-xs text-[#b13e32]">{formErrors.interest}</span>}</label><label className="mt-5 block text-xs font-bold text-[#4f4b45]">Your question <textarea value={form.message} onChange={(e) => updateForm('message', e.target.value)} className="field mt-2 min-h-[110px] resize-y" placeholder="What would you like to know?" data-testid="textarea-message" /></label><div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><span className="text-[11px] leading-4 text-[#8b847b]">We only use these details to respond to your inquiry.</span><button type="submit" className="button-primary button-dark" data-testid="button-submit-inquiry">Send inquiry <Send size={15} /></button></div></form>}</div></div></section>

        <section className="bg-[#193b42] py-20 text-[#f6f2e9]"><div className="container-wide grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end"><div><span className="eyebrow eyebrow-light">Come see what is possible</span><h2 className="mt-5 max-w-[720px] font-display text-[clamp(3rem,6vw,6.5rem)] leading-[.9] tracking-[-.05em]">Your digital future<br /><span className="serif-italic text-[#eeb04a]">can start small.</span></h2></div><div><p className="max-w-[310px] text-sm leading-6 text-white/70">A question, a first lesson, a new kind of confidence. Take the next step when you are ready.</p><button onClick={() => scrollTo('contact')} className="button-primary mt-7" data-testid="button-final-inquiry">Make an admission inquiry <ArrowUpRight size={16} /></button></div></div></section>
        <section className="border-t border-[#d8d0c2] bg-[#f6f2e9] py-7"><div className="container-wide flex flex-col gap-2 text-xs text-[#68635b] sm:flex-row sm:items-center sm:justify-between"><span className="eyebrow">Visit Oxford</span><span data-testid="text-full-address">3, 32 Muni Bhairab Marg, Kathmandu, Bagmati Province 44000</span><a href="tel:9851311567" className="font-bold text-[#b76a3c] hover:underline">Call 9851311567</a></div></section>
       </main>

      <footer className="bg-[#101f31] py-12 text-[#f6f2e9]"><div className="container-wide"><div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.2fr_.8fr_.8fr]"><div><div className="flex items-center gap-3"><img src={instituteLogo} alt="Oxford Technical Institute logo" className="brand-logo h-9 w-9 rounded-full object-cover" /><span><span className="block text-xs font-extrabold tracking-[.17em]">OXFORD</span><span className="block font-mono-custom text-[8px] tracking-[.18em] text-[#eeb04a]">TECHNICAL INSTITUTE</span></span></div><p className="mt-5 max-w-[280px] text-sm leading-6 text-white/55">Practical computer and technology education in Kathmandu, Nepal.</p></div><div><span className="eyebrow eyebrow-light">Explore</span><div className="mt-4 space-y-3 text-sm text-white/65"><button onClick={() => scrollTo('about')} className="block hover:text-white" data-testid="link-footer-about">About</button><button onClick={() => scrollTo('courses')} className="block hover:text-white" data-testid="link-footer-courses">Courses</button><button onClick={() => scrollTo('challenge')} className="block hover:text-white" data-testid="link-footer-challenge">Tech Challenge</button></div></div><div><span className="eyebrow eyebrow-light">Visit</span><p className="mt-4 text-sm leading-6 text-white/65">3, 32 Muni Bhairab Marg<br />Kathmandu, Nepal</p><a href="tel:9851311567" className="mt-3 block text-sm text-[#eeb04a] hover:underline" data-testid="link-footer-phone">9851311567</a></div></div><div className="flex flex-col justify-between gap-4 pt-7 text-[10px] text-white/40 sm:flex-row"><span>© {new Date().getFullYear()} Oxford Technical Institute</span><span className="flex items-center gap-2"><Instagram size={13} /> Digital future, human pace.</span></div></div></footer>
    </div>
  );
}

export default App;