"""Create four original, quiet synthesized expression sounds using only Python."""
from pathlib import Path
import math
import struct
import wave

RATE = 44100
OUT = Path(__file__).parent / 'assets'

def effect(name, length, notes):
    samples = [0.0] * int(length * RATE)
    for start, duration, frequency, end_frequency, level, character in notes:
        phase = 0.0
        for j in range(int(duration * RATE)):
            at = int(start * RATE) + j
            if at >= len(samples):
                break
            t = j / RATE
            progress = t / duration
            hz = frequency * (end_frequency / frequency) ** progress
            if name == 'teary':
                hz *= 1 + .025 * math.sin(2 * math.pi * 7 * t)
            phase += 2 * math.pi * hz / RATE
            tone = math.sin(phase)
            if character == 'bell':
                tone = .78 * tone + .15 * math.sin(phase * 2) + .07 * math.sin(phase * 3)
            elif character == 'grumble':
                tone = .7 * tone + .2 * math.sin(phase * 2) + .1 * math.sin(phase * 3)
            envelope = min(1, t / .018) * min(1, (duration - t) / .07) * math.exp(-2 * progress)
            samples[at] += tone * level * envelope
    assert max(map(abs, samples)) < 1, 'Clipping'
    with wave.open(str(OUT / f'{name}.wav'), 'wb') as wav:
        wav.setparams((1, 2, RATE, 0, 'NONE', 'not compressed'))
        wav.writeframes(b''.join(struct.pack('<h', round(x * 32767)) for x in samples))

effect('sleepy', 1.5, [(0,.7,330,294,.25,'sine'),(.42,.85,262,220,.24,'sine')])
effect('teary', 1.3, [(0,.52,540,330,.27,'sine'),(.57,.62,470,260,.25,'sine')])
effect('happy', 1.0, [(0,.45,523,523,.26,'bell'),(.13,.45,659,659,.24,'bell'),(.26,.65,784,784,.24,'bell')])
effect('grumpy', .85, [(0,.22,155,110,.3,'grumble'),(.22,.22,155,105,.3,'grumble'),(.44,.32,145,85,.3,'grumble')])
print('Created sleepy, teary, happy and grumpy WAV effects.')

# One original melody, arranged in four moods with a decaying piano-like timbre.
melody = [72,76,79,76,74,72,69,67,72,74,76,79,77,76,74,72]
for mood, beat, shift, volume in [('sleepy',.60,-12,.21),('teary',.54,-12,.23),('happy',.32,0,.25),('grumpy',.27,-24,.27)]:
    notes = []
    for i, midi in enumerate(melody):
        if mood == 'teary' and midi % 12 in (4,9):
            midi -= 1
        hz = 440 * 2 ** ((midi + shift - 69) / 12)
        notes.append((i*beat, beat*1.7, hz, hz, volume, 'bell'))
        if i % 4 == 0:
            bass = [48,45,53,55][i//4] + (-12 if mood == 'grumpy' else 0)
            freq = 440 * 2 ** ((bass - 69) / 12)
            notes.append((i*beat, beat*3, freq, freq, .13, 'bell'))
    effect(f'piano-{mood}', len(melody)*beat+1.8, notes)
print('Created four arrangements of the original music-box melody.')
