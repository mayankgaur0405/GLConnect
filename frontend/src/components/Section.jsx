import React from "react";

const Section = ({ section }) => {
  return (
    <div className="border rounded-xl p-4 mb-4 shadow bg-white">
      <h2 className="text-xl font-bold mb-2">{section.title}</h2>

      {section.type === "semester" ? (
        // agar semester hai to subjects dikhayenge
        <div>
          {section.subjects?.map((subject, idx) => (
            <div key={idx} className="mb-3 pl-3 border-l-2 border-blue-400">
              <h3 className="text-lg font-semibold">{subject.name}</h3>
              <ul className="list-disc pl-5">
                {subject.resources?.map((res, rIdx) => (
                  <li key={rIdx}>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {res.name} ({res.type})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        // agar topic hai to direct resources dikhayenge
        <ul className="list-disc pl-5">
          {section.resources?.map((res, idx) => (
            <li key={idx}>
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {res.name} ({res.type})
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Section;
