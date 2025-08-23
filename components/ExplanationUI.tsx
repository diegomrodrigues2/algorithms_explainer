import React from 'react';

export const CodeBlock = ({ children }: { children?: React.ReactNode }) => (
    <pre className="bg-slate-900/70 rounded-md p-4 my-4 text-sm text-cyan-300 overflow-x-auto border border-slate-700">
        <code>{children}</code>
    </pre>
);

export const SectionTitle = ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-2xl font-bold text-cyan-400 mt-6 mb-3 border-b-2 border-slate-700 pb-2">{children}</h3>
);

export const SubTitle = ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-xl font-semibold text-slate-300 mt-4 mb-2">{children}</h4>
);

export const ListItem = ({ children }: { children?: React.ReactNode }) => (
    <li className="mb-2 pl-4 border-l-2 border-cyan-500/50 text-slate-300">{children}</li>
);

export const Table = ({ headers, rows }: { headers: string[], rows: (string|React.ReactNode)[][] }) => (
    <div className="overflow-x-auto my-4">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr>
                    {headers.map((header, i) => (
                        <th key={i} className="border-b-2 border-slate-600 p-2 bg-slate-700/50 text-slate-200 font-semibold">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i} className="bg-slate-800/50 hover:bg-slate-700/50">
                        {row.map((cell, j) => (
                            <td key={j} className="border-b border-slate-700 p-2 text-slate-300">
                                {typeof cell === 'string' ? <code>{cell}</code> : cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);