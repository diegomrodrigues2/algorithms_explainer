
import React from 'react';
import { useBinaryEncoding } from '../hooks/useBinaryEncoding';
import BinaryEncodingControls from './BinaryEncodingControls';

const Byte = ({ value, isHighlighted }: { value: number, isHighlighted: boolean }) => {
    const hex = value.toString(16).padStart(2, '0').toUpperCase();
    const highlightClass = isHighlighted ? 'bg-cyan-500/30 ring-2 ring-cyan-400' : 'bg-slate-700 ring-1 ring-slate-600';
    return (
        <div className={`w-12 h-12 flex flex-col items-center justify-center rounded-md font-mono text-white transition-all duration-300 ${highlightClass}`}>
            <span className="text-lg">{hex}</span>
            <span className="text-xs text-slate-400">{value}</span>
        </div>
    );
};

const BinaryEncodingVisualizer = () => {
    const { step, input, isPlaying, speed, currentStep, totalSteps, actions } = useBinaryEncoding();
    const { phase, encodedBytes, decodedObject, message, highlights } = step;

    const getPartHighlightClass = (partName?: string) => {
        if (!partName) return '';
        if (partName.includes('Tag')) return 'bg-purple-500/20';
        if (partName.includes('Tamanho')) return 'bg-yellow-500/20';
        if (partName.includes('Valor')) return 'bg-emerald-500/20';
        return '';
    }

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Input / Decoded */}
                <div className="lg:col-span-2 space-y-4">
                     <div>
                        <h3 className="text-lg font-semibold text-slate-300 mb-2">Objeto de Entrada</h3>
                        <div className="bg-slate-900/70 p-3 rounded-lg min-h-[6rem] border border-slate-700 font-mono text-sm">
                            <div className={highlights.inputKey === 'userId' ? 'bg-cyan-500/20 p-1 rounded' : 'p-1'}>
                               <span className="text-amber-400">"user_id"</span>: <span className="text-emerald-400">{input.userId}</span>
                            </div>
                            <div className={highlights.inputKey === 'name' ? 'bg-cyan-500/20 p-1 rounded' : 'p-1'}>
                               <span className="text-amber-400">"name"</span>: <span className="text-emerald-400">"{input.name}"</span>
                            </div>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-slate-300 mb-2">Objeto Decodificado</h3>
                        <div className="bg-slate-900/70 p-3 rounded-lg min-h-[6rem] border border-slate-700 font-mono text-sm">
                           {decodedObject && Object.keys(decodedObject).map(key => (
                                <div key={key} className={highlights.decodedKey === key ? 'bg-cyan-500/20 p-1 rounded' : 'p-1'}>
                                   <span className="text-amber-400">"{key}"</span>: <span className="text-emerald-400">{JSON.stringify(decodedObject[key])}</span>
                                </div>
                           ))}
                        </div>
                    </div>
                </div>

                {/* Encoded Bytes */}
                <div className="lg:col-span-3">
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Payload Codificado (Bytes)</h3>
                    <div className={`relative bg-slate-900/70 p-3 rounded-lg min-h-[14rem] border border-slate-700 flex flex-wrap gap-2 transition-colors duration-300 ${getPartHighlightClass(highlights.partName)}`}>
                        {encodedBytes?.map((byte, index) => {
                            const isHighlighted = highlights.byteRange && index >= highlights.byteRange[0] && index < highlights.byteRange[1];
                            return <Byte key={index} value={byte} isHighlighted={isHighlighted} />;
                        })}
                        {highlights.partName && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-slate-800 rounded-md text-xs text-slate-300 border border-slate-600">
                                {highlights.partName}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-12 text-center my-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <BinaryEncodingControls
                onEncodeAndDecode={actions.encodeAndDecode}
                onReset={actions.reset}
                isPlaying={isPlaying}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                initialUserId={input.userId}
                initialName={input.name}
            />
        </div>
    );
};

export default BinaryEncodingVisualizer;
