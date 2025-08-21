import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import React from "react";

const internshipResources = [
  {
    name: "LinkedIn",
    description:
      "The world's largest professional network. Excellent for finding and applying to internships directly.",
    url: "https://www.linkedin.com/jobs/internship-jobs/",
  },
  {
    name: "Indeed",
    description:
      "A leading job search engine that aggregates listings from thousands of websites.",
    url: "https://www.indeed.com/q-internship-jobs.html",
  },
  {
    name: "Simplify",
    description:
      "A popular tool for students to find and autofill internship and new-grad applications.",
    url: "https://simplify.jobs/",
  },
  {
    name: "Handshake",
    description:
      "Connects college students with employers for jobs and internships. Often partnered with universities.",
    url: "https://wgu.joinhandshake.com/explore",
  },
  {
    name: "Built In",
    description:
      "A great resource for finding tech jobs and internships, especially at startups and tech companies.",
    url: "https://builtin.com/jobs/intern",
  },
  {
    name: "JobRight.ai",
    description:
      "AI-powered job recommendation platform to help you find relevant roles faster.",
    url: "https://jobright.ai/jobs/recommend",
  },
  {
    name: "Cvrve",
    description:
      "A curated list of top internship opportunities, focusing on quality over quantity.",
    url: "https://jobs.cvrve.me/intern",
  },
  {
    name: "Summer 2026 Internships (GitHub)",
    description:
      "A community-curated list of Summer 2026 tech internships. Maintained by Pitt CSC & Simplify.",
    url: "https://github.com/SimplifyJobs/Summer2026-Internships",
  },
  {
    name: "Open Source Internships (GitHub)",
    description:
      "A curated list of open-source internship programs like GSoC, Outreachy, and more.",
    url: "https://github.com/deepanshu1422/List-Of-Open-Source-Internships-Programs",
  },
];

export default function InternshipSearchPage() {
  return (
    <div className="min-h-screen max-w-full">
      <div className="min-h-screen max-w-full">
        <div className="flex">
          {/* Sidebar */}

          <div className="size-svw mx-auto pt-8">
            <div className="container mx-full px-4 py-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight">
                  Find Your Next Internship
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Explore these top resources to discover your next opportunity.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                {internshipResources.map((resource) => (
                  <Card key={resource.name} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{resource.name}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow" />
                    <CardFooter>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full">
                          Visit Site
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
