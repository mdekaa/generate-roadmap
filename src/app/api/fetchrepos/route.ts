
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    const outlineHeadings = query.split('\n');
    const topRepos = [];

    for (const heading of outlineHeadings) {
      const response = await axios.get(`https://api.github.com/search/repositories`, {
        params: {
          q: `${query} ${heading}`,
          sort: 'stars',
          order: 'desc',
          per_page: 1,
          page: 1,
        },
        headers: {
          Authorization: `token ${process.env.GITHUB_PAT}`,
          'User-Agent': 'axios/1.7.2',
        },
      });

      const repo = response.data.items[0];
      if (repo) {
        const { full_name, description, html_url } = repo;
        const repoObject = { full_name, description, html_url };
        topRepos.push(repoObject);
      }
    }

    return NextResponse.json({ repos: topRepos });
  } catch (error) {
    console.error('Error fetching repos:', error);
    return NextResponse.json({ error: 'Failed to fetch repos' }, { status: 500 });
  }
}
