
import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const BinaryEncodingExplanation = () => {
    const pythonImplementation = `from __future__ import annotations
from typing import Tuple, Dict, Any

# Wire types (subset)
WT_VARINT = 0
WT_LEN = 2

def encode_varint(value: int) -> bytes:
    out = bytearray()
    while True:
        to_write = value & 0x7F
        value >>= 7
        if value:
            out.append(to_write | 0x80)
        else:
            out.append(to_write)
            break
    return bytes(out)

def encode_key(field_number: int, wire_type: int) -> bytes:
    return encode_varint((field_number << 3) | wire_type)

def encode_string(value: str) -> bytes:
    raw = value.encode('utf-8')
    return encode_varint(len(raw)) + raw

def encode_user_profile(user_id: int, name: str) -> bytes:
    buf = bytearray()
    # field 1, varint
    buf += encode_key(1, WT_VARINT)
    buf += encode_varint(user_id)
    # field 2, length-delimited
    buf += encode_key(2, WT_LEN)
    buf += encode_string(name)
    return bytes(buf)
`;

    const pythonUsage = `payload = encode_user_profile(user_id=150, name="Ada")
obj = decode_user_profile(payload)
assert obj == {'user_id': 150, 'name': 'Ada'}`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">📦 Codificador Binário (Protobuf)</h2>

            <SectionTitle>Contexto</SectionTitle>
            <p className="text-slate-300">
                Formatos binários baseados em esquema (como Protocol Buffers, Thrift e Avro) substituem nomes textuais de campos por identificadores numéricos compactos e tipos de fio (wire types), reduzindo bytes “no fio” e acelerando serialização/desserialização.
            </p>
            
            <SectionTitle>Passo a passo da implementação</SectionTitle>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <ListItem><strong>Varint</strong>: inteiros em base-128 com MSB como bit de continuação.</ListItem>
                <ListItem><strong>Chave do campo</strong>: <code>key = (field_number {'<<'} 3) | wire_type</code>, codificada como varint.</ListItem>
                <ListItem><strong>Tipos de fio</strong>: <code>0 = varint</code>, <code>2 = length-delimited</code> (strings, etc.).</ListItem>
                <ListItem><strong>Codificação</strong>:
                    <ul className="list-disc list-inside ml-4 mt-2">
                        <li><code>user_id</code> (1, varint): <code>key(1,0)</code> + <code>varint(user_id)</code>.</li>
                        <li><code>name</code> (2, len-delimited): <code>key(2,2)</code> + <code>varint(len)</code> + <code>bytes</code>.</li>
                    </ul>
                </ListItem>
                 <ListItem><strong>Decodificação</strong>: ler <code>key</code>, derivar <code>(field, type)</code>, ler valor, pular campos desconhecidos.</ListItem>
            </ol>

            <SectionTitle>Implementação de Referência (Python)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SubTitle>Como usar</SubTitle>
            <CodeBlock>{pythonUsage}</CodeBlock>
            
            <SectionTitle>Leituras</SectionTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem>Guia de Codificação do Protobuf</ListItem>
                <ListItem>Análise de Varints por Russ Cox</ListItem>
            </ul>
        </div>
    );
};

export default BinaryEncodingExplanation;
