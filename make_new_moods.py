"""Original three mood arrangements, rendered with additive synthesis; no external recordings."""
from pathlib import Path
import math, wave, array
R=22050
OUT=Path(__file__).parent/'assets'
def hz(n):return 440*2**((n-69)/12)
def render(name,beat,chords,phrases):
 duration=32*beat+3
 a=[0.0]*int(duration*R)
 def tone(start,n,length,vol):
  f=hz(n)
  for j in range(min(int(length*R),len(a)-int(start*R))):
   t=j/R; env=min(1,t/.028)*math.exp(-t/1.25)*min(1,(length-t)/.22)
   v=math.sin(2*math.pi*f*t)+.22*math.sin(2*math.pi*f*2.003*t)*math.exp(-t*2)+.07*math.sin(2*math.pi*f*3*t)*math.exp(-t*4)
   a[int(start*R)+j]+=vol*v*env
 for bar,chord in enumerate(chords*2):
  start=bar*4*beat
  # Slightly rolled voicings and gentle alternating bass.
  tone(start,chord[0]-12,3.8*beat,.10)
  for k,n in enumerate(chord):tone(start+.035*k,n,4.3*beat,.055)
  for pos,n in phrases[bar%len(phrases)]:tone(start+pos*beat+.012*math.sin(bar*3+pos),n,1.7*beat,.14 if name!='tired' else .105)
 # Soft room reflections; fade the end to silence.
 for delay,gain in [(.13,.11),(.29,.07)]:
  off=int(delay*R)
  for i in range(len(a)-1,off-1,-1):a[i]+=a[i-off]*gain
 peak=max(map(abs,a));scale=min(1,.74/peak)
 samples=array.array('h',(round(v*scale*min(1,(duration-i/R)/2)*32767) for i,v in enumerate(a)))
 with wave.open(str(OUT/f'piano-{name}.wav'),'wb') as w:w.setparams((1,2,R,0,'NONE','not compressed'));w.writeframes(samples.tobytes())
 # Short selection motif uses the beginning of the same palette.
 short=array.array('h',(round(a[i]*scale*.65*max(0,1-i/(R*1.8))*32767) for i in range(int(R*1.8))))
 with wave.open(str(OUT/f'{name}.wav'),'wb') as w:w.setparams((1,2,R,0,'NONE','not compressed'));w.writeframes(short.tobytes())
render('calm',.83,[[48,55,59,64],[45,52,59,60],[53,60,64,67],[55,62,65,69]],[[(.5,76),(2,79),(3.2,76)],[(0,74),(1.5,72),(3,71)],[(.5,69),(2,72),(3.2,76)],[(0,74),(2,71),(3,72)]])
render('anxious',.56,[[45,52,59,60],[53,60,64,69],[50,57,60,65],[52,59,64,68]],[[(0,76),(.75,77),(1.5,76),(2.75,71)],[(0,72),(1,76),(2.5,74),(3.25,72)],[(.5,74),(1.25,76),(2,74),(3,69)],[(0,71),(1.5,68),(2.75,69)]])
render('tired',1.07,[[50,57,60,65],[46,53,57,62],[53,60,64,69],[48,55,60,64]],[[(.5,69),(2.5,65)],[(.25,65),(1.75,62),(3,60)],[(.5,64),(2.5,60)],[(.5,62),(2.5,60)]])
print('Rendered three original arrangements and selection sounds.')
