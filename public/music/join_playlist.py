import pydub
import os

def join_playlists(pa, pb, po):
    with open(po, 'w') as pof:
        with open(pa, 'r') as paf:
            ll = paf.readlines()
            for l in ll:
                pof.write(l)
            last_line = ll[-1]
            song, start_time = last_line.split(',')
            start_time = int(start_time)
            song_seg = pydub.AudioSegment.from_file(song.replace('music/', ''))
            next_time = start_time + len(song_seg)

        with open(pb, 'r') as pbf:
            for l in pbf.readlines():
                song, start_time = l.split(',')
                pof.write('{},{}\n'.format(song, int(start_time) + next_time))
