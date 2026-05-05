// React/src/app/global.firewall.ts

function cyrb53(str: string, seed = 0): string {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, "0");
}

const generateDeviceNoise = (): string => {
    if (typeof window === 'undefined') return 'server_static_noise';
    return cyrb53([
        navigator.userAgent,
        window.screen.colorDepth,
        navigator.language,
        "QQM_SECURITY_SALT"
    ].join('|'));
};

const MASTER_NOISE = generateDeviceNoise();

export const StrictEngine = {
    hashKey(rawKey: string): string {
        return cyrb53(rawKey + MASTER_NOISE, 0x8a2f);
    },
    encodeValue(value: any): string {
        const payload = typeof value === 'string' ? value : JSON.stringify(value);
        const noiseBytes = new TextEncoder().encode(MASTER_NOISE);
        const payloadBytes = new TextEncoder().encode(payload);

        const xored = new Uint8Array(payloadBytes.length);
        for (let i = 0; i < payloadBytes.length; i++) {
            // Bitwise XOR operation (Super Cepat)
            xored[i] = payloadBytes[i] ^ noiseBytes[i % noiseBytes.length];
        }

        return btoa(String.fromCharCode.apply(null, Array.from(xored)));
    },

    decodeValue<T = any>(obfuscatedB64: string): T | null {
        if (!obfuscatedB64) return null;
        try {
            const binary = atob(obfuscatedB64);
            const xored = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) xored[i] = binary.charCodeAt(i);

            const noiseBytes = new TextEncoder().encode(MASTER_NOISE);
            const payloadBytes = new Uint8Array(xored.length);
            for (let i = 0; i < xored.length; i++) {
                payloadBytes[i] = xored[i] ^ noiseBytes[i % noiseBytes.length];
            }

            const decodedStr = new TextDecoder().decode(payloadBytes);
            try { return JSON.parse(decodedStr); } catch { return decodedStr as any; }
        } catch {
            // Target mencoba edit manual string base64 / corupt = tolak
            return null;
        }
    }
};

export function seededPRNG(seed: number) {
    return function () {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export function applyPseudoRandomTransform(payload: string, seedMaster: number = 1999): Uint8Array {
    const bytes = new TextEncoder().encode(payload);
    const prng = seededPRNG(seedMaster);
    const result = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
        // Noise mask dari keributan angka CSPRNG yang repetitif
        const noiseMask = Math.floor(prng() * 256);
        result[i] = bytes[i] ^ noiseMask;
    }
    return result;
}

export function arnoldsCatMapTransform(payload: string, iterations: number = 5): Uint8Array {
    const bytes = new TextEncoder().encode(payload);
    const len = bytes.length;
    const N = Math.ceil(Math.sqrt(len));
    if (N === 0) return new Uint8Array(0);

    const grid = new Uint8Array(N * N);
    grid.set(bytes);

    let current = new Uint8Array(grid);
    let next = new Uint8Array(N * N);

    for (let iter = 0; iter < iterations; iter++) {
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                // Formula Chaos Map di Torus
                const newX = (2 * x + y) % N;
                const newY = (x + y) % N;
                next[newY * N + newX] = current[y * N + x];
            }
        }
        current.set(next);
    }
    return current;
}

export function frozenQuantumStateNoise(sizeLength: number, steps: number = 20): Uint8Array {
    const posSize = 2 * steps + 1;
    const center = steps;

    let ampL = new Float64Array(posSize);
    let ampR = new Float64Array(posSize);

    ampL[center] = 1.0;
    const root2 = 1.0 / Math.sqrt(2);

    let nextL = new Float64Array(posSize);
    let nextR = new Float64Array(posSize);

    for (let t = 0; t < steps; t++) {
        nextL.fill(0); nextR.fill(0);

        for (let x = 1; x < posSize - 1; x++) {
            nextL[x - 1] += root2 * (ampL[x] + ampR[x]);
            nextR[x + 1] += root2 * (ampL[x] - ampR[x]);
        }

        let tempL = ampL; ampL = nextL; nextL = tempL;
        let tempR = ampR; ampR = nextR; nextR = tempR;
    }

    const noise = new Uint8Array(sizeLength);
    for (let i = 0; i < sizeLength; i++) {
        const pos = i % posSize;
        // P = |L|^2 + |R|^2
        const prob = (ampL[pos] * ampL[pos]) + (ampR[pos] * ampR[pos]);
        noise[i] = Math.floor(prob * 9999999) % 256;
    }
    return noise;
}