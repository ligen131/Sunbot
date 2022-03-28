# coding:utf-8

from os import path
import sys
import jieba
from wordcloud import WordCloud, STOPWORDS

ExcludeWord = ['我', '你', '了', '的', '是', '吧', '吗', '在', '不', '都', '就', '没', '有', '也', '又', '他', '她', '们']

def word_segment(text):
  jieba_word = jieba.cut(text, cut_all = False)
  seg_list = ' '.join(jieba_word)
  return seg_list

def generate_wordcloud(text):
  font_path = path.join("./fonts/msyh.ttf")
  stopwords = set(STOPWORDS)
  wc = WordCloud(background_color = "black",
          max_words = 200, 
          width = 1080,
          height = 768,
          min_font_size = 6,
          relative_scaling = 0.5,
      #    mask = alice_mask,
          stopwords = stopwords,
          font_path = font_path,
          repeat = False,
                )

  wc.generate(text)
  _output = sys.argv[2]
  wc.to_file(_output)

if __name__=='__main__':

  _file = sys.argv[1]
  text = open(_file, encoding = 'UTF8').read()
  for x in ExcludeWord:
    text = text.replace(x, " ")
  text = word_segment(text)
  generate_wordcloud(text)