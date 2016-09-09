# Use Pandas and numpy
import numpy as np
import pandas as pd

# Time-series data - each iteration is a day
# each day (each iteration) = 200 random numbers
# random numbers are drawn around '6' (for 6% point lead) but high variance - mu = 6, sigma = 5

# 1. Build population: 10k random numbers centered at 6
# 2. Sample 200/day over 5 months (~30 * 5 = 150 days)
# 3. Plot samples

def generatePop(popSize = 100, popMean = 6, dist = "hetero", spread = 0.5, noiseMean = 0):
    """Generate a simulated population.

    Parameters
    ==========
    popSize : int
        A positive number representing the size of the population to generate.

    popMean : int
        A number representing the mean / trend in polls

    dist : str
        A str of value i) 'uniform' or ii) 'normal' that represents the approach
        to random number generation of the population.

    spread : int
        If using random normal = the SD of the distribution.
        If using random uniform = scaling a [-1, 1) distribution

    randMean : int
        If using random normal = the mean of the distribution of noise


    Returns
    =======
    simPop : array
        1-d real array representing the leads for individuals within a
        simulated population.
    """

    if (dist == "uniform"):
        noise = (2 * np.random.rand(popSize) - 1) * spread
        signal = (2 * np.random.rand(popSize) - 1) * spread
        simPop = signal + (noise * popMean)
    elif (dist == "normal"):
        noise = np.random.normal(loc = noiseMean, scale = spread, size = popSize)
        signal = np.random.normal(loc = popMean, scale = 0.1, size = popSize)
        simPop = signal + (noise * popMean)
    elif (dist == "hetero"):
        # Heteroscedastic Gaussian noise added to signal
        #signal = np.random.normal(loc = popMean, scale = 0.1, size = popSize)
        projj = np.random.randint(100, size = popSize) + 1.3 + 0.4 * np.random.random(popSize)
        signal = popMean + np.sin(2 * np.pi * projj / 0.05)
        ySigma = spread * popMean + spread * popMean * np.random.random(popSize)
        simPop = np.random.normal(signal, ySigma * popMean * 1.5)

    #simPop = signal + (noise * popMean)

    return simPop

def getBetaPop(popSize = 100, popMean = 6, alpha = 2, beta = 0.5, low = 0, hi = 1):
    """Generate a simulated population from a Beta distribution.

    Parameters
    ==========
    popSize : int
        A positive number representing the size of the population to generate.

    popMean : int
        A number representing the mean / trend in polls

    alpha : float

    beta : float

    low : int / float
        Low constraint for range

    hi : int / float
        High constraint for range

    Returns
    =======
    simPop : array
        1-d real array representing the leads for individuals within a
        simulated population of Beta distributions.
    """

    noise = low + (np.random.beta(alpha, beta, size = popSize) * (hi - low))

    simPop = noise

    return simPop

def getSingleDay(pop, sampleSize = 10):
    """Simulate sampling (single day) from population.

    Parameters
    ==========
    pop : array
      1-d real array of total population

    sampleSize : int
      A number from 1 - size(pop) range that sets the daily sampling rate.

    Returns
    =======
    singleDay : array
      1-d real array representing a single day sampling of the population.
    """

    singleDay = np.random.choice(pop, size = sampleSize)

    return singleDay

def rangeSamples(pop, sSize = 10, sTime = 10):
    """Simulate mean of samples per

    Parameters
    ==========
    pop : array
      1-d real array of total population

    sSize : int
      A number from 1 - size(pop) range that sets the daily sampling rate.

    Returns
    =======
    allSamples : array
      1-d real array representing the daily samples over a timeframe.
    """

    allSamples = []
    allCols = []
    allMeans = []

    for i in range(sTime):
        tmpArray = getSingleDay(pop, sampleSize = sSize)
        allSamples.append(tmpArray)
        allCols.append("Col_%s" % str(i))
        allMeans.append(tmpArray.mean())

    return allSamples, allCols, allMeans

# Alt: sample 2% of population
#sampleDay = population.sample(frac = 0.02, replace = False)

np.random.seed(1738)

# Generate population of 1k centered at 6%, normal distribution of noise
population = generatePop(popSize = 1000, popMean = 6, dist = "hetero", spread = 0.5, noiseMean = 0)

##### NOT USED: for personal exploration only
# Generate beta population of 100k
#bLow = getBetaPop(popSize = 1000, popMean = 6, alpha = 1, beta = 0.1, low = -1, hi = 0)
#bHi = getBetaPop(popSize = 100000, popMean = 6, alpha = 1, beta = 0.1, low = 0, hi = 1)
#bPopulation = getBetaPop(popSize = 100000, popMean = 6, alpha = 1, beta = 0.1, low = -1, hi = 1)
######

yearArray, yearCols, yearMeans = rangeSamples(population, sSize = 200, sTime = 365)

# Data summary

popSeries = pd.Series(population)
popSeries.describe()

# Pandas x DataFrame

yearTableT = pd.DataFrame(yearArray)
yearTable = yearTableT.transpose()
yearTable.columns = yearCols

# Viz
%pylab inline       # for notebook...

polls = pd.Series(yearMeans, index = pd.date_range('6/1/2000', periods = 365))
polls.plot()


###
###
###
###

## WAV! - AUDIO

def specgram_cbar(x, title = None, clim = (0, 80)):
    """Plot spectrogram with a colorbar and range normalization.

    Call matplotlib's specgram function, with a custom figure size,
    automatic colobar, title and custom color limits to ease
    comparison across multiple figures.

    Parameters
    ==========
    x : array
      One-dimensional array whose spectrogram should be plotted.

    title : string
      Optional title for the figure.

    clim : 2-tuple
      Range for the color limits plotted in the spectrogram.
    """
    f = plt.figure(figsize=(10,3))
    plt.specgram(x)
    plt.colorbar()
    plt.clim(*clim)
    if title is not None:
        plt.title(title)
    plt.show()

def compress_signal(x, fraction):
    """Compress an input signal by dropping a fraction of its spectrum.

    Parameters
    ==========
    x : array
      1-d real array to be compressed

    fraction : float
      A number in the [0,1] range indicating which fraction of the spectrum
      of x should be zeroed out (1 means zero out the entire signal).

    Returns
    =======
    x_approx : array
      1-d real array reconstructed after having compressed the input.
    """

    # Find smallest frequency
    wavFreq = np.fft.rfft(x, axis = 0)
    wavIndx = np.argsort(wavFreq)
    dropRange = int(len(wavIndx) * fraction)
    wavCompress = wavFreq.copy()

    # Dropout
    for i in range(dropRange):
        wavCompress[wavIndx[i]] = 0

    x_approx = np.fft.irfft(wavCompress, axis = 0)
    return x_approx



def compress_wav(fname, fraction):
    """Compress an audio signal stored in an input wav file.

    The compressed signal is returned as a numpy array and automatically written
    to disk to a new wav file.

    Parameters
    ==========
    fname : string
      Name of the input wav file

    fraction : float
      Fraction of input data to keep.

    Returns
    =======
    rate : int
      Bit rate of the input signal.

    x : array
      Raw data of the original input signal.

    x_approx : array
      Raw data of the compressed signal.

    new_fname : string
      Auto-generated filename of the compressed signal.
    """

    rate, x = wavy.read(fname)
    new_fname = "compressed_%s.wav" % str(fraction)

    # Find smallest frequency
    wavFreq = np.fft.rfft(x, axis = 0)
    wavIndx = np.argsort(wavFreq)
    dropRange = int(len(wavIndx) * fraction)
    wavCompress = wavFreq.copy()

    # Dropout
    for i in range(dropRange):
        wavCompress[wavIndx[i]] = 0

    # Save out wav for first compression (FFT to IFFT)
    x_approx = np.round(np.fft.irfft(wavCompress, axis = 0)).astype("int16")
    wavy.write(new_fname, rate, x_approx)
    return rate, x, x_approx, new_fname



# Play changing this in the 0-1 range
fractions = [0.1, 0.5, 0.75, 0.9, 0.95, 0.99, 0.0]

# 90%
wavRate90, wavX90, wavCompress90, wavName90 = compress_wav("data/voice.wav", fractions[3])
# 95%
wavRate95, wavX95, wavCompress95, wavName95 = compress_wav("data/voice.wav", fractions[4])
# 99%
wavRate99, wavX99, wavCompress99, wavName99 = compress_wav("data/voice.wav", fractions[5])
# 0%
wavRate, wavX, wavCompress, wavName = compress_wav("data/voice.wav", fractions[6])

# Dictonary
compressMap = {'c10': wavName10, 'c50': wavName50,
               'c75': wavName75, 'c90': wavName90,
               'c95': wavName95, 'c99': wavName99}
compressMap['c10']

# List of tuples
compressList = (('c10', wavName10), ('c50', wavName50),
               ('c75', wavName75), ('c90', wavName90),
               ('c95', wavName95), ('c99', wavName99),
               ('c0', wavName))

wavList = (('c10', wavCompress10), ('c50', wavCompress50),
               ('c75', wavCompress75), ('c90', wavCompress90),
               ('c95', wavCompress95), ('c99', wavCompress99),
               ('c0', wavCompress))

               import collections

# Now ordered dictonary
voices = collections.OrderedDict(compressList)
voices

# Iterate through orderedDict
for keyy in voices.items():
    Audio(voices[keyy[0]])
    specgram_cbar(wavez[keyy[0]])


def Audio(fname):
    """Provide a player widget for an audio file.

    Parameters
    ==========
    fname : string
      Filename to be played.

    Warning
    =======

    Browsers cache audio very aggressively. If you change an
    audio file on disk and are trying to listen to the  new version, you
    may want to
    """
    from IPython.display import HTML, display

    # Find out file extension and deduce MIME type for audio format
    ext = os.path.splitext(fname)[1].replace('.', '').lower()
    mimetype = 'audio/' + ('mpeg' if ext == 'mp3' else ext)

    tpl = """<p>{fname}:</p>
<audio controls>
    <source src="files/{fname}" type="{mimetype}">

Your browser does not support the Audio element; you can play
<a href="files/{fname}">this file</a> manually.
</audio>
"""
    display(HTML(tpl.format(**locals())))
