import re
import collections
import nltk
from nltk import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.stem.snowball import SnowballStemmer

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

class matcher:
    interns = []
    texts = []

    def cluster_texts(nb_of_clusters=5):

        def clean(text):
            # load nltk's English stopwords as variable called 'stopwords'
            stopwords = nltk.corpus.stopwords.words('english')

            # remove non-alphabet characters
            text_cleaned = re.sub("[^a-zA-Z]", " ", text)

            # # text into array of words
            # text_cleaned_array = text_cleaned.lower().split()

            # # remove stop words
            # text_cleaned_array = [word for word in text_cleaned_array if not word in stops] 

            return text_cleaned

        tfidf_vectorizer = TfidfVectorizer(tokenizer=word_tokenizer,
                                        stop_words=stopwords.words('english'),
                                        max_df=0.9,
                                        min_df=0.1,
                                        lowercase=True)

        matcher.texts = [clean(i.interests) for i in matcher.interns]

        #builds a tf-idf matrix
        tfidf_matrix = tfidf_vectorizer.fit_transform(matcher.texts)
        kmeans = KMeans(n_clusters=nb_of_clusters)
        kmeans.fit(tfidf_matrix)
        clusters = collections.defaultdict(list)

        for i, label in enumerate(kmeans.labels_):
                clusters[label].append(i)

        return dict(clusters)

class intern:
    def __init__(self, name, position, interests):
        self.name = name
        self.position = position
        self.interests = interests

def word_tokenizer(text):
    #tokenizes and stems the text
    tokens = word_tokenize(text)
    stemmer = PorterStemmer()
    tokens = [stemmer.stem(t) for t in tokens if t not in stopwords.words('english')]
    return tokens

if __name__ == '__main__':
    person1 = intern('liza', 'tech', 'baseball, gaming, piano')
    person2 = intern('jake', 'tech', 'baseball, flute, jumping')
    person3 = intern('claire', 'tech', 'singing, animals')

    interns = [person1, person2, person3]

    matcher.interns = [i for i in interns]

    nClusters = 2

    clusters = matcher.cluster_texts(nClusters)

    for cluster in range(nClusters):
            print("cluster " + str(cluster) + ":")
            for i, n in enumerate(clusters[cluster]):
                print ("\tintern: ", i ,": ",matcher.texts[n])

            