import { EnterpriseStrategyPlan } from '@/types';

export function EnterprisePlanSections({ plan }: { plan: EnterpriseStrategyPlan }) {
    return (
        <div className="space-y-6">
            <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">1. Executive Summary</h2>
                <p className="text-text-secondary mb-4">{plan.executiveSummary.overview}</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-text-secondary">
                    <div>
                        <p className="font-semibold text-text-primary mb-2">Global Priorities</p>
                        <ul className="list-disc list-inside space-y-1">
                            {plan.executiveSummary.globalPriorities.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-text-primary mb-2">Risks & Mitigation</p>
                        <ul className="list-disc list-inside space-y-1">
                            {plan.executiveSummary.globalRisks.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">2. Global & Regional Market Overview</h2>
                <p className="text-text-secondary mb-4">{plan.marketOverview.globalSnapshot}</p>
                <div className="grid gap-4">
                    {plan.marketOverview.regions.map((region, idx) => (
                        <div key={idx} className="border border-border-primary rounded-lg p-4 bg-bg-primary dark:bg-bg-secondary text-sm text-text-secondary">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-text-primary">{region.region}</h3>
                                <span className="text-xs text-text-tertiary">{region.marketMaturity}</span>
                            </div>
                            <p className="mb-2">{region.customerBehavior}</p>
                            <div className="grid md:grid-cols-2 gap-2">
                                <div>
                                    <p className="font-semibold text-text-primary mb-1">Opportunities</p>
                                    <ul className="list-disc list-inside">
                                        {region.opportunities.map((item, oppIdx) => (
                                            <li key={oppIdx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-semibold text-text-primary mb-1">Risks</p>
                                    <ul className="list-disc list-inside">
                                        {region.risks.map((item, riskIdx) => (
                                            <li key={riskIdx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6 space-y-4">
                <h2 className="text-xl font-semibold text-text-primary">3. Segmentation, Target Audiences & Use Cases</h2>
                <div className="space-y-3">
                    {plan.segmentationAndUseCases.globalSegments.map((segment, idx) => (
                        <div key={idx} className="border border-border-primary rounded-lg p-3 bg-bg-primary dark:bg-bg-secondary text-sm text-text-secondary">
                            <p className="font-semibold text-text-primary">{segment.name}</p>
                            <p>{segment.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">4. Objectives & KPIs Linked to Outcomes</h2>
                <div className="space-y-4">
                    {plan.objectivesAndKPIs.map((objective, idx) => (
                        <div key={idx} className="border border-border-primary rounded-lg p-4 bg-bg-primary dark:bg-bg-secondary text-sm text-text-secondary">
                            <p className="font-semibold text-text-primary">{objective.businessGoal}</p>
                            <p className="mb-2">{objective.marketingObjective}</p>
                            <p className="text-xs text-text-tertiary">
                                Primary KPIs: {objective.primaryKPIs.join(', ')} | Leading Indicators: {objective.leadingIndicators.join(', ')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">5. Governance, Operating Model & Roles</h2>
                <p className="text-sm text-text-secondary mb-4">{plan.governanceModel.decisionFramework}</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-text-secondary">
                    <div>
                        <p className="font-semibold text-text-primary mb-1">Executive Sponsors & Global Leads</p>
                        <ul className="list-disc list-inside">
                            {[...plan.governanceModel.executiveSponsors, ...plan.governanceModel.globalMarketingLeads].map((role, idx) => (
                                <li key={idx}>{role}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-text-primary mb-1">Cross-Functional Partners</p>
                        <ul className="list-disc list-inside">
                            {plan.governanceModel.crossFunctionalPartners.map((partner, idx) => (
                                <li key={idx}>{partner}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">6. Resourcing & Budget Framework</h2>
                <p className="text-sm text-text-secondary mb-4">{plan.resourcingAndBudget.budgetModel.summary}</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-text-secondary">
                    <div>
                        <p className="font-semibold text-text-primary mb-1">Headcount Plan</p>
                        <ul className="list-disc list-inside">
                            {plan.resourcingAndBudget.headcountPlan.map((role, idx) => (
                                <li key={idx}>
                                    <span className="font-medium text-text-primary">{role.function}:</span> {role.notes}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-text-primary mb-1">Channel Allocations</p>
                        <ul className="list-disc list-inside">
                            {plan.resourcingAndBudget.budgetModel.channelAllocations.map((allocation, idx) => (
                                <li key={idx}>
                                    {allocation.channel} — {allocation.percentage}% ({allocation.notes})
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">7. Technology, Data & Compliance</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-text-secondary">
                    <div>
                        <p className="font-semibold text-text-primary mb-1">Martech Stack</p>
                        <ul className="list-disc list-inside">
                            {plan.technologyDataCompliance.martechStack.map((tool, idx) => (
                                <li key={idx}>
                                    <span className="font-medium text-text-primary">{tool.category}:</span> {tool.recommendation}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-text-primary mb-1">Compliance Checklist</p>
                        <ul className="list-disc list-inside">
                            {plan.technologyDataCompliance.complianceChecklist.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6 space-y-3">
                <h2 className="text-xl font-semibold text-text-primary">8. Integrated Channel & Campaign Strategy</h2>
                <p className="text-sm text-text-secondary">{plan.integratedChannelStrategy.lifecycleNarrative}</p>
                {plan.integratedChannelStrategy.channels.map((channel, idx) => (
                    <div key={idx} className="border border-border-primary rounded-lg p-4 bg-bg-primary dark:bg-bg-secondary text-sm text-text-secondary">
                        <p className="font-semibold text-text-primary">{channel.channel}</p>
                        <p>{channel.role}</p>
                        <p className="text-xs text-text-tertiary">Key Metrics: {channel.keyMetrics.join(', ')}</p>
                    </div>
                ))}
            </div>

            <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">9. Regional Playbooks</h2>
                <div className="grid gap-4 text-sm text-text-secondary">
                    {plan.regionalPlaybooks.map((region, idx) => (
                        <div key={idx} className="border border-border-primary rounded-lg p-4 bg-bg-primary dark:bg-bg-secondary">
                            <p className="font-semibold text-text-primary">{region.region}</p>
                            <p>{region.localizedTactics.join('; ')}</p>
                            <p className="text-xs text-text-tertiary mt-1">Budget Guidance: {region.budgetGuidance}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">10. Measurement, Optimization & Reporting</h2>
                <p className="text-sm text-text-secondary mb-2">Global Dashboard KPIs: {plan.measurementAndOptimization.globalDashboard.join(', ')}</p>
                <p className="text-sm text-text-secondary mb-2">
                    Test & Learn Framework: {plan.measurementAndOptimization.testAndLearnFramework.join(' | ')}
                </p>
                <p className="text-xs text-text-tertiary">
                    Reallocation Guidelines: {plan.measurementAndOptimization.reallocationGuidelines.join(' | ')}
                </p>
            </div>

            <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">11. 90–180 Day Roadmap</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-text-secondary">
                    <div>
                        <p className="font-semibold text-text-primary mb-1">Quick Wins (90 Days)</p>
                        <ul className="list-disc list-inside">
                            {plan.roadmap90To180.quickWins90Days.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-text-primary mb-1">90–180 Day Initiatives</p>
                        <ul className="list-disc list-inside">
                            {plan.roadmap90To180.initiatives90To180.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <p className="text-xs text-text-tertiary mt-2">Dependencies: {plan.roadmap90To180.dependencies.join(', ')}</p>
            </div>
        </div>
    );
}
