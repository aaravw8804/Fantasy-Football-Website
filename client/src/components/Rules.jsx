import React from "react";
import "./Rules.css";

const Rules = () => {
  return (
    <div className="rules-container">
      <h1>Fantasy League Rules</h1>
      
      <h2>1. Team Building & Squad:</h2>
      <p><strong>Squad Size:</strong> You typically have a squad of 15 players, including goalkeepers, defenders, midfielders, and forwards.</p>
      <p><strong>Position Limits:</strong> There are usually limits on how many players from a single real-life club you can have in your squad.</p>
      <p><strong>Drafting/Selection:</strong> You either draft players from a pool of available players or select them from a list, building your team based on their potential and performance.</p>
      <p><strong>Formation:</strong> You need to select a starting 11 for each matchday, with a minimum number of players in each position (e.g., 1 goalkeeper, at least 3 defenders, at least 2 midfielders, at least 1 forward).</p>

      <h2>2. Scoring:</h2>
      <p><strong>Points for Performance:</strong> Players earn points for goals, assists, clean sheets, and other actions, with different point values depending on the position and action.</p>
      <p><strong>Captain:</strong> You designate a captain, whose points are doubled for the matchday.</p>
      <p><strong>Bonus Points:</strong> Some leagues award bonus points for the best-performing players in each match.</p>

      <h2>3. Matchday & Transfers:</h2>
      <p><strong>Matchday Selection:</strong> You select your starting 11 for each matchday, and the points scored by those players in the actual matches count towards your fantasy score.</p>
      <p><strong>Transfers:</strong> You can make changes to your squad by making transfers, replacing players with others, but there are often limitations or penalties for excessive transfers.</p>
      <p><strong>Free Transfers:</strong> You may have a limited number of free transfers per gameweek, beyond which transfers may incur a point penalty.</p>

      <h2>4. Leagues & Competition:</h2>
      <p><strong>Leagues:</strong> You compete in leagues with other managers, with the winner being the manager who accumulates the most points over the season.</p>
      <p><strong>Playoffs:</strong> Some leagues have a playoff system where the top teams compete for the championship.</p>
      <p><strong>Private Leagues:</strong> You can create private leagues to compete with friends.</p>

      <h2>5. Key Concepts:</h2>
      <p><strong>Form:</strong> Pay attention to players' recent form and form history.</p>
      <p><strong>Fixtures:</strong> Consider the fixtures of the real-life teams, as this can affect player performance.</p>
      <p><strong>Price:</strong> Players have different values, and you need to manage your budget effectively.</p>
      <p><strong>Ownership:</strong> Consider how many other managers have a particular player, as this can affect their availability and value.</p>
    </div>
  );
};

export default Rules;
