import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BlogPost() {
    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col px-6 py-24 sm:py-32">
            <Link href="/blogs" className="text-foreground/50 hover:text-foreground transition-colors flex items-center gap-2 mb-12 w-fit">
                <ArrowLeft className="w-4 h-4" />
                back to blogs
            </Link>

            <h1 className="text-3xl sm:text-[40px] leading-[1.15] font-bold tracking-tight text-foreground mb-6">
                Studio Ghibli Style Art with AI (my thoughts, no hard feelings)
            </h1>

            <div className="flex items-center gap-4 text-foreground/50 text-sm font-mono mb-12 pb-8 border-b border-foreground/10">
                <span>Feb 15, 2025</span>
                <span>•</span>
                <span>5 min read</span>
            </div>

            <div className="flex flex-col gap-6 text-[17px] leading-[1.8] text-foreground/80">
                <div className="bg-foreground/5 p-6 rounded-2xl mb-6 border border-foreground/10">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Quick Read: AI Generated Summary</h3>
                    <p className="text-sm">
                        In this post, I dive into how AI is reshaping art—using Studio Ghibli’s style as an example—by challenging elitist views and addressing concerns about creativity and art theft. I reflect on a personal midnight snack story to highlight how accessible art has become, argue that AI is simply a new tool for creative expression, and emphasize that innovation in art has always built upon what came before. Ultimately, I celebrate the democratization of art and encourage everyone to embrace these new creative possibilities.
                    </p>
                </div>

                <h2 id="part1" className="text-2xl font-bold tracking-tight text-foreground mt-4">Part 1:</h2>

                <p>
                    <img
                        src="https://i.ibb.co/TDRfqw5g/blog.png"
                        alt="Blog header image"
                        className="float-left w-1/2 sm:w-1/3 h-auto object-contain rounded-xl mr-5 mb-2 mt-1 border border-foreground/10 shadow-sm"
                    />
                    <em>I'll start with a little story from yesterday.</em><br />
                    Last night, I was hit with a serious snack craving around midnight <em>(yeah, I know I should fix my sleep schedule)</em>. So I tossed some potatoes into an automated chopper, threw the slices into an air fryer, and well, well... I had my midnight french fries. And honestly? <strong className="text-foreground">In that moment, they tasted like heaven.</strong>
                </p>

                <p>Now, if you're an art snob, you might say that I didn't really cook.<br />
                    Because, obviously, unless I’m using a wood-fired oven, harvesting ingredients from a farmer named Ghalib who sings lullabies to his potatoes, hand-grinding spices, and slow-roasting everything over an open flame for twelve hours... I’ve apparently committed a crime against cuisine.</p>

                <p>Well, I understand your feelings, but let's be honest: <strong className="text-foreground">this is nothing but a very narrow-minded, elitist mentality</strong> where you're being nothing but <strong className="text-foreground">extremely pretentious</strong>. You see yourselves as <em>“real” artists</em> or curators of culture, and anything outside that tradition is automatically seen as fake or shallow. You just want to <strong className="text-foreground">gatekeep</strong> it.</p>

                <p>Back when photography first came around, painters and traditional artists freaked out. They thought photography would kill art-- like, <em>“Why would anyone paint anymore when you can just snap a picture?”</em> But eventually, photography became its own art form, with its own techniques, styles, and creativity. So that fear? <strong className="text-foreground">It was fake.</strong></p>

                <p>AI art is kind of the same. It’s not replacing art, it’s just a new tool that lets people express ideas in a different way. Just like a camera doesn’t make someone a great photographer automatically, AI doesn’t make someone an amazing artist by default. But give it to someone with vision and creativity? <strong className="text-foreground">They can do amazing things with it.</strong> And I’ve seen so much incredible AI art that I could never create myself, but it’s amazing.</p>

                <p>And this whole thing doesn’t cheapen <em>“real”</em> art. It just opens the door to more people making their kind of art. That’s it.</p>

                <p>Now, I might’ve used some strong words in the beginning, but if you're still reading, well, I genuinely don’t like this elitist mentality. <strong className="text-foreground">It’s toxic.</strong> Why do you hate the idea of decentralising art if it’s making it more accessible to people? I generated a few pictures of myself in Studio Ghibli’s style, and honestly, I was really happy with the result. There are so many people who would’ve never been able to see themselves in that kind of art unless this technology existed.</p>

                <p><strong className="text-foreground">Why do you hate the idea of people being happy?</strong><br />
                    These are just questions to reflect on.</p>

                <h2 className="text-2xl font-bold tracking-tight text-foreground mt-8">Part 2:</h2>
                <p><em>Now, I wanna address the “elephant in the room” about the question of “stealing art”</em></p>

                <p>This is the big-one and probably the most misunderstood part of the AI art debate.</p>

                <p><strong className="text-foreground">Disclaimer:</strong> Let’s be clear right from the start: yes, some AI models have been trained unethically. There are cases where copyrighted artwork was scraped from the internet without artists’ permission and fed into training datasets. That’s a serious problem, and artists have every right to be upset about it. <strong className="text-foreground">Consent and attribution matter.</strong></p>

                <p>But let’s also be honest that’s not what all AI art is. <strong className="text-foreground">Not every use of AI is stealing.</strong> Lumping everything under the same accusation oversimplifies a much more complex and much more interesting conversation.</p>

                <p>There’s a difference between the tool and how it’s used. Just like a camera can capture your own moment or be misused to plagiarize someone else’s work. AI can either generate something original based on prompts, or intentionally copy an existing artist’s exact style. It all comes down to <strong className="text-foreground">intent and ethics</strong>.</p>

                <p>If someone’s generating Ghibli-style art for fun-imagining themselves in a whimsical world and it’s not a frame-for-frame copy of an actual scene or character, then let’s be real: <strong className="text-foreground">that’s not theft. That’s fan art.</strong> And fan art has existed for decades. People have been doing it with pencils, paint, Photoshop, now they’re doing it with AI. <em>Same energy, new medium.</em></p>

                <p>And, if we’re being real here, <strong className="text-foreground">you can’t copyright a vibe</strong>. A color palette. A brushstroke. If that were possible, Van Gogh’s swirls or Studio Ghibli’s dreamlike tones would be locked away forever. What you can protect is the actual artwork-specific characters, compositions, designs, stories.</p>

                <p>So when AI generates something inspired by a style but not copying a specific scene or character <strong className="text-foreground">that’s not stealing</strong>. That’s how all art works. Someone saw Miyazaki’s magic and wanted to create their own story that feels like it belongs in that universe. That’s not a crime, <strong className="text-foreground">that’s creativity</strong>.</p>

                <p><strong className="text-foreground">Now, I wanna talk more from the perspective of Logic and Philosophy.</strong></p>

                <p>Nothing in art has ever been created in a vacuum. Every artist, whether traditional or digital, stands on the shoulders of those who came before them. Styles evolve, blend, clash, and remix over time. You study what you love, consciously or unconsciously absorb it, and then reinterpret it in your own way.</p>

                <p>Van Gogh learned from Japanese woodblock prints. Picasso was influenced by African tribal art. Miyazaki himself has spoken about being shaped by European animation and storytelling. So when someone says <em>“AI stole my style,”</em> we need to take a step back and ask: <strong className="text-foreground">what even is originality?</strong></p>

                <p>Your favorite artist likely “stole,” borrowed <em>(i'm skeptical about using these two words)</em>, or adapted techniques from someone else. That’s not theft <strong className="text-foreground">it’s the history of art.</strong> The difference is, humans do it slowly and subtly. AI just does it faster and more obviously.</p>

                <p><strong className="text-foreground">Now, for y’all artsy people who don’t understand technology let me enlighten you with something since I am an advocate against gatekeeping.</strong></p>

                <p><strong className="text-foreground">How does AI even “learn” art?</strong></p>

                <p>AI doesn’t copy images pixel by pixel. It doesn't have a folder labeled “Ghibli Art” that it pulls from like a clipart gallery. What it does is learn patterns from huge datasets: color palettes, composition trends, brushstroke textures, lighting, anatomy proportions... basically, math. It “sees” a thousand forests and starts to understand what makes a forest feel like a forest.</p>

                <p>When trained on a diverse, ethical dataset, it doesn’t replicate art, it generates new interpretations based on those learned patterns.</p>

                <p>Is that different from a human spending years studying art books, film stills, museum pieces, and Pinterest boards, then drawing something in a style that feels like what they’ve seen? Not really. One’s just carbon-based. The other’s code.</p>

                <p><strong className="text-foreground">So is AI stealing? Or are people just uncomfortable with how fast it’s learning?</strong></p>

                <p>There are real ethical questions when AI models are trained without consent but let’s not pretend this is a clean line in the art world either. Artists have always copied each other. They've always riffed off trends, styles, and movements. AI is just doing what we’ve always done… at scale, and faster.</p>

                <p>The truth is, most people crying <em>“theft”</em> aren’t even the ones being stolen from. <strong className="text-foreground">They just hate the idea of creativity being democratized.</strong> Of losing control over what “counts” as real art.</p>

                <p>But guess what? <strong className="text-foreground">Creativity doesn’t belong to the few anymore. It never should’ve.</strong></p>

                <h2 className="text-2xl font-bold tracking-tight text-foreground mt-8">Part 3:</h2>
                <p>In the end, I'd like to say that this doesn't really change anything about art for passionate people. For example, I’ve never talked about this before, but I have a thing for vinyl records. I can literally stream music for free, but I still pay for a record. That said, I also stream music on Spotify or YouTube Music <em>(and sometimes Apple Music, lmao)</em>.</p>

                <p>Similarly, many people pay for hand-knitted sweaters, or there's this Japanese brand called <strong className="text-foreground">Momotaro Jeans</strong>. They're a Japanese denim brand known for their high-quality, handcrafted jeans made with premium selvedge denim. People who are passionate about denim pay the premium for that but they also don't disqualify all other jeans.</p>

                <p>It's the same idea: <strong className="text-foreground">more accessibility means more people can afford it</strong>, while you can still pay the premium for your <em>“pure art.”</em> You can still get a wood-fired oven, harvest ingredients from a farmer named Ghalib who sings lullabies to his potatoes, hand-grind spices, and slow-roast everything over an open flame for twelve hours for your very “American” French fries.</p>
            </div>
        </div>
    );
}
