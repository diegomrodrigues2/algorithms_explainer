
import React, { useState } from 'react';
import { PlayIcon, ResetIcon } from './Icons';

interface ControlsProps {
    onEncodeAndDecode: (userId: number, name: string) => void;
    onReset: () => void;
    isPlaying: boolean;
    speed: number;
    onSpeedChange: (value: number) => void;
    initialUserId: number;
    initialName: string;
}

const BinaryEncodingControls = ({ onEncodeAndDecode, onReset, isPlaying, speed, onSpeedChange, initialUserId, initialName }: ControlsProps) => {
    const [userId, setUserId] = useState(initialUserId);
    const [name, setName] = useState(initialName);

    const handleEncodeDecode = () => {
        if (!isPlaying) {
            onEncodeAndDecode(userId, name);
        }
    };

    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col sm:flex-row gap-2 items-end">
                    <div className="flex-1">
                        <label htmlFor="user-id" className="block text-sm font-medium text-slate-300">User ID</label>
                        <input
                            id="user-id"
                            type="number"
                            value={userId}
                            onChange={(e) => setUserId(Number(e.target.value))}
                            className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50"
                            disabled={isPlaying}
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50"
                            disabled={isPlaying}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="speed-binary" className="block text-sm font-medium text-slate-300">
                        Velocidade da Animação
                    </label>
                    <input
                        id="speed-binary"
                        type="range"
                        min="50"
                        max="1000"
                        value={speed}
                        onChange={(e) => onSpeedChange(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </div>
            </div>
            
            <div className="mt-6 flex items-center gap-4">
                <button
                    onClick={handleEncodeDecode}
                    disabled={isPlaying || !name}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 transition-colors"
                >
                    <PlayIcon />
                    Codificar & Decodificar
                </button>
                <button
                    onClick={onReset}
                    disabled={isPlaying}
                    className="flex items-center justify-center w-12 h-12 bg-slate-600 text-white rounded-full hover:bg-slate-700 disabled:opacity-50"
                    aria-label="Resetar"
                >
                    <ResetIcon />
                </button>
            </div>
        </div>
    );
};

export default BinaryEncodingControls;
