"use client"

import React, { useState } from 'react';
import axios from 'axios';

const CourseGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [roadmap, setRoadmap] = useState<string>('');
  const [repos, setRepos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCourse = async () => {
    try {
      setError(null);
      const response = await axios.post('/api/generatecourse', { topic });
      const outline = response.data.outline;

      setRoadmap(outline);

      const fetchReposPromises = outline.split('\n').map(async (subchapter: string) => {
        try {
          const reposResponse = await axios.post('/api/fetchrepos', { query: `${topic} ${subchapter}` }, {
            headers: {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
          });
          const filteredRepos = filterTopRepos(reposResponse.data.repos);
          return { subchapter, repos: filteredRepos };
        } catch (error) {
          console.error(`Error fetching repos for ${subchapter}:`, error);
          return { subchapter, repos: [] };
        }
      });

      const reposData = await Promise.all(fetchReposPromises);
      setRepos(reposData);
    } catch (error) {
      console.error('Error generating course:', error);
      setError('Failed to generate course. Please try again.');
    }
  };

  const filterTopRepos = (repos: any[]): any[] => {
    // Optionally filter or manipulate repos as needed
    return repos;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">AI Course Generator</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Course Topic"
        className="border p-2 mb-4 w-full text-black"
      />
      <button
        onClick={handleGenerateCourse}
        className="bg-green-500 text-white py-2 px-4"
      >
        Generate Course
      </button>

      {roadmap && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Course Roadmap</h2>
          <pre className="bg-gray-100 p-4 text-black">{roadmap}</pre>
          {repos.map((subchapterRepos: any, index: number) => (
            <div key={index} className="mt-4">
              <h2 className="text-xl font-semibold">{subchapterRepos.subchapter}</h2>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {subchapterRepos.repos.map((repo: any, repoIndex: number) => (
                  <div key={repoIndex} className="bg-white shadow-md rounded-lg overflow-hidden">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="p-4">
                        <p className="text-lg font-semibold mb-2">{repo.full_name}</p>
                        <p className="text-gray-600">{repo.description}</p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseGenerator;
