import pydub
import numpy as np
import os

SR = 44100
ENDING = 500
SILENCE_THR = 100
PREFIX = 'music'

def dur_to_ms(ds):
    d = [int(x) for x in ds.split('.')]
    return (d[0] * 60 + d[1]) * 1000

def ms_to_dur(d):
    m = d // (60 * 1000)
    s = d // 1000 % 60
    return '{}.{}'.format(m, s)

def mean_amp(seg):
    return np.mean(np.abs(seg.get_array_of_samples()))

def partition_file_with_durations(audio_file, durations_file,
                                  output_folder, output_playlist):
    full_audio = pydub.AudioSegment.from_file(audio_file)
    with open(durations_file, 'r') as f:
        durations = [dur_to_ms(ds) for ds in f.readlines()]

    acum = 0
    with open(output_playlist, 'w') as pl:
        for c, d in enumerate(durations):
            print('Audio #', c, 'duration = ', ms_to_dur(d), 'interva = [',
                  ms_to_dur(acum),',', ms_to_dur(acum+d))
            start_time = acum
            seg = full_audio[acum:acum+d]

            ending = seg[-ENDING:]
            if mean_amp(ending) > SILENCE_THR:
                print('Ending too loud. Mean amp: ', mean_amp(ending))
                endings = [
                    (acum + d + ENDING * np.max(m, 0),
                     full_audio[acum + d + ENDING * min(m, 0):
                                acum + d + ENDING * max(m, 0)])
                    for m in range(-2, 5)
                    if m != 0
                ]
                selected = min(endings, key=lambda x: mean_amp(x[1]))

                seg = full_audio[acum:selected[0]]
                acum = selected[0]
                print('Ending too loud. New duration: ',
                      ms_to_dur(selected[0]), '. New mean amp: ',
                      mean_amp(selected[1])
                     )
            else:
                acum += d
            filename = '{:02d}.mp3'.format(c)
            out_path = os.path.join(output_folder, filename)
            print('Saving mp3 to:', out_path)
            seg.export(out_path, format='mp3')
            pl.write('{}, {}\n'.format(os.path.join(PREFIX, out_path), start_time))
