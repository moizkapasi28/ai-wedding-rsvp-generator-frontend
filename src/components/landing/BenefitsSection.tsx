import { Zap, Clock, TrendingUp } from "lucide-react";

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-primary/5 relative overflow-hidden">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <Zap className="mr-2 h-4 w-4" />
              <span>The Future of Weddings</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
              Why RSVP Genius is the smart choice
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Traditional wedding planning is exhausting, time-consuming, and prone to errors. We're leveraging the latest AI technology to handle the heavy lifting, so you can focus on celebrating your love.
            </p>
            
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Save hundreds of hours</h4>
                  <p className="text-muted-foreground">Stop chasing guests for RSVPs or manually entering data into spreadsheets. Our automated system handles it all.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Wand2Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">AI Invite Creation</h4>
                  <p className="text-muted-foreground">Let our AI assist in generating beautiful invite cards so you don't have to start from scratch.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Event-based Organization</h4>
                  <p className="text-muted-foreground">Keep track of which guests are attending which events, along with their dietary requirements.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="lg:w-1/2 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-2xl transform rotate-3 scale-105 -z-10 blur-xl"></div>
            <div className="bg-background border border-border rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-semibold">Guest Analytics</h3>
                  <p className="text-sm text-muted-foreground">Live overview</p>
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium rounded-full">
                  Updated just now
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Attending</span>
                    <span className="text-muted-foreground">142 / 150</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Pending</span>
                    <span className="text-muted-foreground">8 / 150</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '6%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-border grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Vegetarian</p>
                  <p className="text-2xl font-bold">34</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Kids</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Inline icon component since it wasn't imported from lucide-react in this file
function Wand2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
      <path d="m14 7 3 3" />
      <path d="M5 6v4" />
      <path d="M19 14v4" />
      <path d="M10 2v2" />
      <path d="M7 8H3" />
      <path d="M21 16h-4" />
      <path d="M11 3H9" />
    </svg>
  );
}
