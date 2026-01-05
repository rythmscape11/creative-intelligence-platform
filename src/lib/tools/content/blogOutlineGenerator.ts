export type BlogTemplate = 'how-to' | 'listicle' | 'guide' | 'comparison' | 'case-study';

export interface BlogOutline {
  title: string;
  introduction: string[];
  sections: { heading: string; points: string[] }[];
  conclusion: string[];
}

export function generateBlogOutline(topic: string, template: BlogTemplate): BlogOutline {
  switch (template) {
    case 'how-to':
      return generateHowToOutline(topic);
    case 'listicle':
      return generateListicleOutline(topic);
    case 'guide':
      return generateGuideOutline(topic);
    case 'comparison':
      return generateComparisonOutline(topic);
    case 'case-study':
      return generateCaseStudyOutline(topic);
    default:
      return generateHowToOutline(topic);
  }
}

function generateHowToOutline(topic: string): BlogOutline {
  return {
    title: `How to ${topic}: A Step-by-Step Guide`,
    introduction: [
      `Hook: Start with a relatable problem or question about ${topic}`,
      `Explain why ${topic} is important`,
      `Preview what readers will learn`,
      `Mention the time/effort required`
    ],
    sections: [
      {
        heading: `Understanding ${topic}`,
        points: [
          `Define what ${topic} means`,
          `Explain the key concepts`,
          `Common misconceptions to avoid`
        ]
      },
      {
        heading: `What You'll Need`,
        points: [
          `List required tools/resources`,
          `Prerequisites or skills needed`,
          `Estimated time and budget`
        ]
      },
      {
        heading: `Step 1: [First Major Step]`,
        points: [
          `Detailed instructions`,
          `Tips for success`,
          `Common mistakes to avoid`
        ]
      },
      {
        heading: `Step 2: [Second Major Step]`,
        points: [
          `Detailed instructions`,
          `Visual aids or examples`,
          `Troubleshooting tips`
        ]
      },
      {
        heading: `Step 3: [Third Major Step]`,
        points: [
          `Detailed instructions`,
          `Best practices`,
          `What to expect`
        ]
      },
      {
        heading: `Advanced Tips and Tricks`,
        points: [
          `Pro-level strategies`,
          `Optimization techniques`,
          `Next-level improvements`
        ]
      }
    ],
    conclusion: [
      `Recap the main steps`,
      `Encourage readers to take action`,
      `Mention next steps or related topics`,
      `Call-to-action (comment, share, subscribe)`
    ]
  };
}

function generateListicleOutline(topic: string): BlogOutline {
  return {
    title: `10 Essential Tips for ${topic}`,
    introduction: [
      `Hook with a surprising statistic or fact`,
      `Explain why ${topic} matters`,
      `Preview the list items`,
      `Set expectations for what readers will gain`
    ],
    sections: [
      {
        heading: `1. [First Tip]`,
        points: [
          `Explain the tip`,
          `Why it's important`,
          `How to implement it`,
          `Example or case study`
        ]
      },
      {
        heading: `2. [Second Tip]`,
        points: [
          `Explain the tip`,
          `Benefits and results`,
          `Action steps`,
          `Common pitfalls`
        ]
      },
      {
        heading: `3-9. [Additional Tips]`,
        points: [
          `Follow the same structure for each`,
          `Keep each section concise`,
          `Use examples and data`,
          `Include visuals where helpful`
        ]
      },
      {
        heading: `10. [Final Tip - Make it Memorable]`,
        points: [
          `End with a powerful tip`,
          `Tie back to the introduction`,
          `Leave readers with actionable advice`
        ]
      }
    ],
    conclusion: [
      `Summarize the key takeaways`,
      `Encourage implementation`,
      `Ask which tip readers will try first`,
      `CTA for engagement`
    ]
  };
}

function generateGuideOutline(topic: string): BlogOutline {
  return {
    title: `The Complete Guide to ${topic}`,
    introduction: [
      `Establish authority on the subject`,
      `Explain the scope of the guide`,
      `Who this guide is for`,
      `What readers will master by the end`
    ],
    sections: [
      {
        heading: `Chapter 1: Fundamentals of ${topic}`,
        points: [
          `Core concepts and definitions`,
          `Historical context or background`,
          `Why it matters today`
        ]
      },
      {
        heading: `Chapter 2: Getting Started`,
        points: [
          `Prerequisites and requirements`,
          `Initial setup or preparation`,
          `First steps for beginners`
        ]
      },
      {
        heading: `Chapter 3: Intermediate Techniques`,
        points: [
          `Building on the basics`,
          `Common strategies and methods`,
          `Real-world applications`
        ]
      },
      {
        heading: `Chapter 4: Advanced Strategies`,
        points: [
          `Expert-level tactics`,
          `Optimization and scaling`,
          `Avoiding common pitfalls`
        ]
      },
      {
        heading: `Chapter 5: Tools and Resources`,
        points: [
          `Recommended tools`,
          `Helpful resources`,
          `Community and support`
        ]
      },
      {
        heading: `Chapter 6: Case Studies and Examples`,
        points: [
          `Success stories`,
          `Lessons learned`,
          `Practical applications`
        ]
      }
    ],
    conclusion: [
      `Recap the journey`,
      `Next steps for continued learning`,
      `Additional resources`,
      `Invitation to join community or newsletter`
    ]
  };
}

function generateComparisonOutline(topic: string): BlogOutline {
  return {
    title: `${topic}: A Comprehensive Comparison`,
    introduction: [
      `Present the comparison question`,
      `Why this comparison matters`,
      `What factors will be compared`,
      `Help readers make informed decisions`
    ],
    sections: [
      {
        heading: `Overview of Option A`,
        points: [
          `Key features and benefits`,
          `Ideal use cases`,
          `Pricing and value`
        ]
      },
      {
        heading: `Overview of Option B`,
        points: [
          `Key features and benefits`,
          `Ideal use cases`,
          `Pricing and value`
        ]
      },
      {
        heading: `Head-to-Head Comparison`,
        points: [
          `Feature comparison table`,
          `Performance metrics`,
          `User experience differences`
        ]
      },
      {
        heading: `Pros and Cons`,
        points: [
          `Advantages of each option`,
          `Disadvantages to consider`,
          `Trade-offs and considerations`
        ]
      },
      {
        heading: `Which Should You Choose?`,
        points: [
          `Decision framework`,
          `Recommendations for different scenarios`,
          `Final verdict`
        ]
      }
    ],
    conclusion: [
      `Summarize key differences`,
      `Restate recommendations`,
      `Encourage readers to evaluate their needs`,
      `CTA for questions or feedback`
    ]
  };
}

function generateCaseStudyOutline(topic: string): BlogOutline {
  return {
    title: `Case Study: How [Company] Achieved Success with ${topic}`,
    introduction: [
      `Introduce the subject/company`,
      `Present the challenge or problem`,
      `Preview the results achieved`,
      `Why this case study matters`
    ],
    sections: [
      {
        heading: `Background and Context`,
        points: [
          `Company/subject overview`,
          `Industry and market conditions`,
          `Initial situation and challenges`
        ]
      },
      {
        heading: `The Challenge`,
        points: [
          `Specific problems faced`,
          `Impact on business/goals`,
          `Why traditional solutions didn't work`
        ]
      },
      {
        heading: `The Solution`,
        points: [
          `Strategy and approach taken`,
          `Implementation process`,
          `Tools and resources used`
        ]
      },
      {
        heading: `Results and Outcomes`,
        points: [
          `Quantifiable results (metrics, ROI)`,
          `Qualitative improvements`,
          `Timeline of success`
        ]
      },
      {
        heading: `Key Takeaways`,
        points: [
          `Lessons learned`,
          `What worked well`,
          `What could be improved`
        ]
      },
      {
        heading: `How You Can Apply This`,
        points: [
          `Actionable steps for readers`,
          `Adaptations for different contexts`,
          `Resources to get started`
        ]
      }
    ],
    conclusion: [
      `Summarize the transformation`,
      `Reinforce key lessons`,
      `Encourage readers to take action`,
      `CTA for similar services or consultation`
    ]
  };
}

