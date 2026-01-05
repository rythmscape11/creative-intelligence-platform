// Test script to verify Projects API
// Run with: node --loader tsx testProjects.ts

async function testProjectsAPI() {
    try {
        console.log('Testing /api/agency/projects locally...\n');

        // Test 1: Check if server is running
        const healthCheck = await fetch('http://localhost:3000');
        console.log('✓ Server is running\n');

        // Test 2: Try to fetch projects (will likely fail due to auth)
        const projectsRes = await fetch('http://localhost:3000/api/agency/projects');
        console.log('Projects API Status:', projectsRes.status);
        console.log('Projects API Headers:', Object.fromEntries(projectsRes.headers));

        const projectsData = await projectsRes.text();
        console.log('Projects API Response:', projectsData.substring(0, 500));

        if (projectsRes.ok) {
            const parsed = JSON.parse(projectsData);
            console.log('\n✓ API returned data successfully');
            console.log('Number of projects:', parsed.length);
            if (parsed.length > 0) {
                console.log('First project:', JSON.stringify(parsed[0], null, 2));
            }
        } else {
            console.log('\n⚠ API returned error (expected if not authenticated)');
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testProjectsAPI();
