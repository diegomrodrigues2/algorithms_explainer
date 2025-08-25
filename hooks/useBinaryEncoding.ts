
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { BinaryEncodingStep } from '../types';

const INITIAL_SPEED = 500;
const MIN_SPEED = 50;
const MAX_SPEED = 1000;

// Helper functions
function encodeVarint(value: number): number[] {
    if (value < 0) return [];
    const out: number[] = [];
    while (true) {
        let toWrite = value & 0x7F;
        value >>= 7;
        if (value) {
            out.push(toWrite | 0x80);
        } else {
            out.push(toWrite);
            break;
        }
    }
    return out;
}

function decodeVarint(data: number[], offset: number): { value: number, newOffset: number } {
    let shift = 0;
    let result = 0;
    while (true) {
        if (offset >= data.length) throw new Error("Dados truncados");
        const b = data[offset];
        offset += 1;
        result |= (b & 0x7F) << shift;
        if ((b & 0x80) === 0) break;
        shift += 7;
        if (shift > 63) throw new Error("Varint muito longo");
    }
    return { value: result, newOffset: offset };
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const useBinaryEncoding = () => {
    const [input, setInput] = useState({ userId: 150, name: "Ada" });
    const [steps, setSteps] = useState<BinaryEncodingStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((userId: number, name: string) => {
        const newSteps: BinaryEncodingStep[] = [];
        const currentInput = { userId, name };
        let encodedBytes: number[] = [];
        
        const addStep = (message: string, highlights: any, phase: BinaryEncodingStep['phase'] = 'encoding', decoded: any = null) => {
            newSteps.push({
                phase,
                input: currentInput,
                encodedBytes: [...encodedBytes],
                decodedObject: decoded ? {...decoded} : null,
                message,
                highlights
            });
        };

        // --- ENCODING ---
        addStep("Iniciando a codificação...", { inputKey: 'userId' });
        
        // Field 1: userId (varint)
        const userIdTag = (1 << 3) | 0; // field 1, wire type 0
        const userIdTagBytes = encodeVarint(userIdTag);
        encodedBytes.push(...userIdTagBytes);
        addStep(`Campo user_id (1): Tag = ${userIdTag} (0x${userIdTag.toString(16)})`, { inputKey: 'userId', byteRange: [0, userIdTagBytes.length], partName: 'Tag (Campo 1, Tipo Varint)' });

        const userIdValueBytes = encodeVarint(userId);
        const userIdValueStart = encodedBytes.length;
        encodedBytes.push(...userIdValueBytes);
        addStep(`Campo user_id (1): Codificando valor ${userId} como Varint.`, { inputKey: 'userId', byteRange: [userIdValueStart, encodedBytes.length], partName: `Valor (${userId})` });

        // Field 2: name (length-delimited)
        const nameTag = (2 << 3) | 2; // field 2, wire type 2
        const nameTagBytes = encodeVarint(nameTag);
        const nameTagStart = encodedBytes.length;
        encodedBytes.push(...nameTagBytes);
        addStep(`Campo name (2): Tag = ${nameTag} (0x${nameTag.toString(16)})`, { inputKey: 'name', byteRange: [nameTagStart, encodedBytes.length], partName: 'Tag (Campo 2, Tipo String)' });

        const nameBytes = Array.from(textEncoder.encode(name));
        const nameLengthBytes = encodeVarint(nameBytes.length);
        const nameLengthStart = encodedBytes.length;
        encodedBytes.push(...nameLengthBytes);
        addStep(`Campo name (2): Codificando tamanho ${nameBytes.length} como Varint.`, { inputKey: 'name', byteRange: [nameLengthStart, encodedBytes.length], partName: `Tamanho (${nameBytes.length})` });
        
        const nameValueStart = encodedBytes.length;
        encodedBytes.push(...nameBytes);
        addStep(`Campo name (2): Anexando bytes do valor "${name}".`, { inputKey: 'name', byteRange: [nameValueStart, encodedBytes.length], partName: `Valor ("${name}")` });

        addStep("Codificação concluída.", {}, 'encoding');

        // --- DECODING ---
        let decodedObject: { [key: string]: any } = {};
        addStep("Iniciando a decodificação...", {}, 'decoding');
        
        let offset = 0;
        while(offset < encodedBytes.length) {
            const tagStartOffset = offset;
            const { value: tag, newOffset: offsetAfterTag } = decodeVarint(encodedBytes, offset);
            addStep(`Lendo Tag no offset ${tagStartOffset}...`, { byteRange: [tagStartOffset, offsetAfterTag], partName: "Lendo Tag" }, 'decoding', decodedObject);
            
            const fieldNumber = tag >> 3;
            const wireType = tag & 0x07;
            addStep(`Tag decodificada: ${tag}. Campo=${fieldNumber}, Tipo=${wireType}.`, { byteRange: [tagStartOffset, offsetAfterTag], partName: `Tag (Campo ${fieldNumber}, Tipo ${wireType})` }, 'decoding', decodedObject);
            offset = offsetAfterTag;

            if (fieldNumber === 1 && wireType === 0) { // userId
                const valueStartOffset = offset;
                const { value, newOffset } = decodeVarint(encodedBytes, offset);
                decodedObject['user_id'] = value;
                addStep(`Campo 1 (user_id): Valor Varint decodificado é ${value}.`, { byteRange: [valueStartOffset, newOffset], decodedKey: 'user_id', partName: `Valor (${value})`}, 'decoding', decodedObject);
                offset = newOffset;
            } else if (fieldNumber === 2 && wireType === 2) { // name
                const lenStartOffset = offset;
                const { value: len, newOffset: offsetAfterLen } = decodeVarint(encodedBytes, offset);
                addStep(`Campo 2 (name): Tamanho decodificado é ${len}.`, { byteRange: [lenStartOffset, offsetAfterLen], partName: `Tamanho (${len})` }, 'decoding', decodedObject);
                offset = offsetAfterLen;

                const valueBytes = encodedBytes.slice(offset, offset + len);
                const value = textDecoder.decode(new Uint8Array(valueBytes));
                decodedObject['name'] = value;
                addStep(`Campo 2 (name): Valor string decodificado é "${value}".`, { byteRange: [offset, offset + len], decodedKey: 'name', partName: `Valor ("${value}")` }, 'decoding', decodedObject);
                offset += len;
            } else {
                // Skip unknown
            }
        }
        
        addStep("Decodificação concluída.", {}, 'done', decodedObject);
        
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(true);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        const initialStep: BinaryEncodingStep = {
            phase: 'idle',
            input: input,
            encodedBytes: null,
            decodedObject: null,
            message: "Insira os dados e clique em 'Codificar & Decodificar'.",
            highlights: {}
        };
        setSteps([initialStep]);
        setCurrentStepIndex(0);
    }, [input]);

    useEffect(() => {
        reset();
    }, []);

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
            return;
        }
        const timer = setTimeout(() => setCurrentStepIndex(prev => prev + 1), MAX_SPEED - speed + MIN_SPEED);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length, speed]);
    
    const encodeAndDecode = (userId: number, name: string) => {
        if (isPlaying) return;
        setInput({ userId, name });
        // The useEffect on `input` will trigger reset, so we call generateSteps directly.
        generateSteps(userId, name);
    };

    const handleSpeedChange = (newSpeed: number) => setSpeed(newSpeed);

    const currentStepData: BinaryEncodingStep = useMemo(() => steps[currentStepIndex] || {
        phase: 'idle',
        input,
        encodedBytes: null,
        decodedObject: null,
        message: 'Pronto.',
        highlights: {}
    }, [steps, currentStepIndex, input]);
    
    return {
        step: currentStepData,
        input,
        isPlaying,
        speed,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { encodeAndDecode, reset, handleSpeedChange }
    };
};
