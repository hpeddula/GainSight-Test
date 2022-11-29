import "./styles.css";
import { useEffect, useState } from "react";
import moment from 'moment'

export default function App() {
  //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
  const [commits, setCommits] = useState([]);
  const fetchCommits = async () => {
    const fetchedCommits = await fetch(
      "https://api.github.com/repos/hpeddula/GainSight-Test/commits",
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer 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`,
        },
      }
    );
    const finalData = await fetchedCommits.json();
    setCommits(finalData);
  };
  useEffect(() => {
    fetchCommits();
  }, []);
  return (
    <div className="App">
      <h2>Git Hub Commits</h2>
      <ul>
        {commits?.map(({commit:{author:{name,date},message}},index) => (
          <li key={index}>{name} : {message} {moment(date).format('MMM YY, h:mm A')}</li> 
        ))}
      </ul>
    </div>
  );
}
