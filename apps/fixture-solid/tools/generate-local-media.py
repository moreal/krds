"""Author a synthetic test signal and simple geometric video, never speech/signing.
Uses only arithmetic samples and ffmpeg's built-in color/drawbox sources.
"""
from pathlib import Path
import math
import shutil
import struct
import subprocess
import wave
ROOT = Path(__file__).resolve().parents[3]
FIXTURE = ROOT / 'apps/fixture-solid/public/local-assets'
STORIES = ROOT / 'apps/storybook-solid/public/local-assets'
FIXTURE.mkdir(parents=True, exist_ok=True)
with wave.open(str(FIXTURE / 'specimen-audio.wav'), 'wb') as stream:
    stream.setnchannels(1)
    stream.setsampwidth(2)
    stream.setframerate(16000)
    samples = []
    for index in range(32000):
        envelope = min(1, index / 400, max(0, (16000 - index) / 400))
        value = int(6000 * math.sin(2 * math.pi * 440 * index / 16000) * envelope) if index < 16000 else 0
        samples.append(struct.pack('<h', value))
    stream.writeframes(b''.join(samples))
subprocess.run([
    'ffmpeg', '-y', '-f', 'lavfi', '-i', 'color=c=0xdcebf5:s=640x360:r=12:d=2',
    '-i', str(FIXTURE / 'specimen-audio.wav'), '-vf',
    'drawbox=x=0:y=240:w=640:h=120:color=0x245c46:t=fill,drawbox=x=290:y=240:w=80:h=120:color=0x1778a0:t=fill',
    '-c:v', 'libvpx-vp9', '-c:a', 'libopus', '-shortest', str(FIXTURE / 'specimen-media.webm')
], check=True)
for destination in [FIXTURE, STORIES]:
    destination.mkdir(parents=True, exist_ok=True)
    if destination != FIXTURE:
        for filename in ['specimen-audio.wav', 'specimen-media.webm']:
            shutil.copyfile(FIXTURE / filename, destination / filename)
    (destination / 'specimen-captions.vtt').write_text('WEBVTT\n\n00:00.000 --> 00:01.000\n[일정한 높이의 예제 신호음]\n')
    (destination / 'specimen-description.vtt').write_text('WEBVTT\n\n00:00.000 --> 00:02.000\n연한 파란색 배경 아래 초록색 영역과 가운데 파란색 세로 띠가 표시됩니다.\n')
