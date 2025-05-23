import { IconCloud } from "@/components/magicui/icon-cloud";
import { Button } from "@/components/ui/button";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { AuroraText } from "@/components/magicui/aurora-text";


const slugs = [
    "typescript",
    "javascript",
    "dart",
    "java",
    "react",
    "flutter",
    "android",
    "html5",
    "css3",
    "nodedotjs",
    "express",
    "nextdotjs",
    "prisma",
    "amazonaws",
    "postgresql",
    "firebase",
    "nginx",
    "vercel",
    "testinglibrary",
    "jest",
    "cypress",
    "docker",
    "git",
    "jira",
    "github",
    "gitlab",
    "visualstudiocode",
    "androidstudio",
    "sonarqube",
    "figma",
];
// app/page.tsx
export default function HomePage() {
    const images = slugs.map(
        (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`,
    );

    return (
        <div className="flex items-center align-middle w-full justify-evenly flex-wrap">
            <div className="size-full max-w-lg items-center justify-center overflow-hidden pt-8">
                <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                    <p className="text-[2.5rem] font-semibold">
                        The <AuroraText> career launchpad</AuroraText> for students.
                    </p>
                </BoxReveal>


                <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                    <div className="mt-6">
                        <p>
                            -&gt; Your path to a tech internship,
                            <span className="font-semibold text-[#5046e6]"> simplified</span>.
                            <br />
                            -&gt; All your applications,
                            <span className="font-semibold text-[#5046e6]"> one </span> place,
                            <span className="font-semibold text-[#5046e6]"> no missed deadlines</span>.
                            <br />
                        </p>
                    </div>
                </BoxReveal>

                <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                    <Button className="mt-[1.6rem] bg-[#5046e6]">Begin Tracking</Button>
                </BoxReveal>
            </div>


            <div className="flex items-center justify-center overflow-hidden">
                <IconCloud images={images} />
            </div>
        </div>
    );
}
