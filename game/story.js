window.LOVE_STORY = {
  "meta": {
    "title": "心动选修课",
    "subtitle": "从借一支笔开始，慢慢学会看见一个人。",
    "startScore": 50,
    "minScore": 0,
    "maxScore": 100,
    "totalChoices": 23
  },
  "tags": {
    "listening": "倾听",
    "detail": "细节",
    "boundary": "边界感",
    "communication": "沟通",
    "action": "行动",
    "timing": "分寸",
    "courage": "勇气"
  },
  "facts": {
    "hometown": {
      "label": "成都",
      "hint": "她来自成都。想家的时候，会提起楼下的桂花。"
    },
    "taste": {
      "label": "微辣、不吃香菜",
      "hint": "她吃不了太辣，会把香菜一根一根挑到碟子边。"
    },
    "movie": {
      "label": "《怦然心动》",
      "hint": "她的微信签名是电影里的台词，每年冬天都会重看。"
    },
    "drink": {
      "label": "三分糖芋泥奶茶",
      "hint": "她小声点了三分糖芋泥，像怕被人听见。"
    },
    "thunder": {
      "label": "怕打雷",
      "hint": "小时候一个人在家被雷声吓到过，她不太愿意承认。"
    },
    "radio": {
      "label": "《晚风信箱》",
      "hint": "她每周三在广播台读听众来信，声音比平时慢。"
    },
    "confession": {
      "label": "不想要观众",
      "hint": "她说，喜欢为什么非要让那么多人看。"
    },
    "heights": {
      "label": "怕高，却想看夜景",
      "hint": "她想坐一次摩天轮看夜景，又有点怕高。"
    },
    "aquarium": {
      "label": "想去水族馆",
      "hint": "她盯着水族馆海报上的水母，说像会呼吸的灯。"
    }
  },
  "chapters": {
    "ch1": {
      "number": "01",
      "label": "第一章 · 第三排靠窗",
      "title": "第三排靠窗",
      "subtitle": "有些喜欢，是从借一支笔开始的。"
    },
    "ch2": {
      "number": "02",
      "label": "第二章 · 对话框里的晚安",
      "title": "对话框里的晚安",
      "subtitle": "隔着屏幕，也要认真听她说话。"
    },
    "ch3": {
      "number": "03",
      "label": "第三章 · 周末的另一种可能",
      "title": "周末的另一种可能",
      "subtitle": "电影、夜市、图书馆，都是了解她的入口。"
    },
    "ch4": {
      "number": "04",
      "label": "第四章 · 雨伞偏向你",
      "title": "雨伞偏向你",
      "subtitle": "关心是具体的，边界也是。"
    },
    "ch5": {
      "number": "05",
      "label": "第五章 · 只两个人的告白",
      "title": "只两个人的告白",
      "subtitle": "喜欢要说出口，也要给对方留好退路。"
    }
  },
  "start": "c1_class",
  "scenes": {
    "c1_class": {
      "chapter": "ch1",
      "step": 1,
      "background": "classroom",
      "narration": "周一 08:00 · 微积分教室",
      "lines": [
        {
          "speaker": "旁白",
          "text": "周一早上八点，微积分教室。你踩着铃声进门，只剩第三排靠窗还有一个位置。"
        },
        {
          "speaker": "旁白",
          "text": "旁边的女生把书包抱在膝盖上，低头翻笔袋，翻了很久。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "同学……不好意思，你有多余的笔吗？"
        },
        {
          "speaker": "你",
          "text": "有。"
        },
        {
          "speaker": "旁白",
          "text": "她接过笔，指尖碰到你一下，很快缩回去，小声说了句谢谢。"
        },
        {
          "speaker": "旁白",
          "text": "前排有人回头喊她「奶龙酱」，她应了一声，把脸埋得更低。"
        },
        {
          "speaker": "旁白",
          "text": "黑板上讲到极限。她盯着板书，笔尖停在半空。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "sad",
          "text": "……这一步，怎么来的。"
        },
        {
          "speaker": "旁白",
          "text": "窗外的梧桐叶被风掀起一角，阳光落在她的草稿纸上，公式写了一半，停在等号前面。"
        },
        {
          "speaker": "旁白",
          "text": "黑板上的推导还在继续。她却把笔帽咬在嘴边，眉头轻轻皱起来。"
        }
      ],
      "options": [
        {
          "text": "把笔记往中间挪一点，压低声音：「这一步我刚好会。下课要不要一起对一遍？」",
          "delta": 8,
          "tag": "listening",
          "mood": "smile",
          "next": "c1_wechat",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "smile",
              "text": "可以吗？"
            },
            {
              "speaker": "旁白",
              "text": "她飞快看你一眼，又低下头，笔尖在草稿纸上轻轻点了一下。"
            }
          ],
          "reactionCold": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……会不会太麻烦你。"
            },
            {
              "speaker": "旁白",
              "text": "她说完，又赶紧补了一句：不方便就算了。"
            }
          ],
          "note": "先递出善意，再给她选择。不是替她解题，是问她要不要一起。"
        },
        {
          "text": "当作没听见，继续抄板书。",
          "delta": -4,
          "tag": "listening",
          "mood": "sad",
          "next": "c1_wechat",
          "reaction": [
            {
              "speaker": "旁白",
              "text": "她把笔尖按在纸上，没再出声。"
            },
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "……没事，我问问别人。"
            }
          ],
          "note": "她鼓起勇气开口的时候，沉默本身就是一种拒绝。"
        },
        {
          "text": "伸手把她的草稿纸拿过来，直接替她写完。",
          "delta": -7,
          "tag": "boundary",
          "mood": "surprised",
          "next": "c1_wechat",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "surprised",
              "text": "哎——不用……"
            },
            {
              "speaker": "旁白",
              "text": "她把草稿纸抽回去，耳根红得厉害。"
            }
          ],
          "note": "好心也要经过允许。她的草稿纸，不是你的展示板。"
        }
      ],
      "custom": {
        "placeholder": "如果是你，会怎么回应她？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "一起对",
              "要不要",
              "我刚好会",
              "下课讲",
              "可以讲",
              "教你"
            ]
          },
          {
            "option": 1,
            "keys": [
              "没听见",
              "继续抄",
              "不知道",
              "算了",
              "不管"
            ]
          },
          {
            "option": 2,
            "keys": [
              "我来写",
              "拿过来",
              "帮你写",
              "直接写",
              "替你"
            ]
          }
        ],
        "fallback": 1
      }
    },
    "c1_wechat": {
      "chapter": "ch1",
      "step": 2,
      "background": "classroom",
      "narration": "下课铃响 · 第三排靠窗",
      "lines": [
        {
          "speaker": "旁白",
          "text": "下课铃响，人走得差不多了。她收拾得很慢，像在等什么。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "那个……笔记，能借我拍一下吗？就今天这页。"
        },
        {
          "speaker": "你",
          "text": "可以。"
        },
        {
          "speaker": "旁白",
          "text": "她拍完，把手机握在手里，没立刻还你。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "要不……我加你微信？以后有不会的……"
        },
        {
          "speaker": "旁白",
          "text": "话没说完，她自己先摇了摇头。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "算了，当我没说。"
        },
        {
          "speaker": "旁白",
          "text": "走廊的风把她的刘海吹乱，她抬手别到耳后，露出一点发红的耳尖。"
        },
        {
          "speaker": "旁白",
          "text": "她抱着书站在窗边，没有马上走，像是在等一句挽留，又像在给自己找台阶。"
        }
      ],
      "options": [
        {
          "text": "「可以啊。你扫我，还是我扫你？」",
          "delta": 8,
          "tag": "boundary",
          "mood": "smile",
          "next": "c1_library",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "smile",
              "text": "我扫你。"
            },
            {
              "speaker": "旁白",
              "text": "二维码对上时，她抿着嘴笑了一下，又很快垂下眼。"
            }
          ],
          "note": "把选择权交给她，靠近就不会变成冒犯。"
        },
        {
          "text": "什么也没说，把二维码递到她面前。",
          "delta": 2,
          "tag": "action",
          "mood": "normal",
          "next": "c1_library",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "……加上了。"
            },
            {
              "speaker": "旁白",
              "text": "她把手机收好，抱着书先走了。"
            }
          ],
          "note": "行动是快的，但少了那句话，气氛会有点硬。"
        },
        {
          "text": "「加微信可以，先叫声哥。」",
          "delta": -8,
          "tag": "boundary",
          "mood": "surprised",
          "next": "c1_library",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "surprised",
              "text": "……那还是算了。"
            },
            {
              "speaker": "旁白",
              "text": "她抱着书往外走。你追上去解释，她才勉强把二维码递给你。"
            }
          ],
          "note": "玩笑如果让对方不舒服，就不是玩笑。"
        }
      ],
      "custom": {
        "placeholder": "你会怎么接她这句话？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "你扫我",
              "我扫你",
              "当然可以",
              "可以啊",
              "都行"
            ]
          },
          {
            "option": 1,
            "keys": [
              "二维码",
              "直接给",
              "递过去",
              "加吧",
              "好吧"
            ]
          },
          {
            "option": 2,
            "keys": [
              "叫声哥",
              "叫哥",
              "先叫",
              "美女",
              "凭什么"
            ]
          }
        ],
        "fallback": 1
      }
    },
    "c1_night": {
      "chapter": "ch1",
      "step": 3,
      "background": "dorm-night-boy",
      "narration": "晚上 22:47 · 宿舍",
      "lines": [
        {
          "speaker": "旁白",
          "text": "晚上十点四十七，宿舍。"
        },
        {
          "speaker": "旁白",
          "text": "你点开她的朋友圈。她很少发东西，最新一条只有一张电影截图：一棵很老的梧桐树。"
        },
        {
          "speaker": "旁白",
          "text": "签名栏里写着一句英文。你认出那是《怦然心动》里外公说的台词。",
          "learn": [
            "movie"
          ]
        },
        {
          "speaker": "旁白",
          "text": "对话框停在「我通过了你的朋友验证请求」。你打了几个字，又删掉。"
        },
        {
          "speaker": "旁白",
          "text": "你把床头灯调到最暗，手机屏幕的光落在被子上。她的头像是一颗小小的龙眼，安安静静的。"
        },
        {
          "speaker": "旁白",
          "text": "输入框里的光标闪了很久。你忽然发现，原来给一个人发第一条消息，比做完整张卷子还难。"
        }
      ],
      "options": [
        {
          "text": "发一句：「你的签名，是《怦然心动》里外公说的那段吧？」",
          "delta": 8,
          "tag": "detail",
          "mood": "smile",
          "next": "c1_chat",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "smile",
              "text": "你也看过？"
            },
            {
              "speaker": "旁白",
              "text": "过了半分钟，她发来一个很小的树苗表情。"
            },
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "我每年冬天都会重看。"
            }
          ],
          "note": "从她愿意被看见的地方开口，比一句「在吗」更靠近。"
        },
        {
          "text": "发「在吗？」",
          "delta": 2,
          "tag": "timing",
          "mood": "normal",
          "next": "c1_chat",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "在。"
            },
            {
              "speaker": "旁白",
              "text": "然后对话框安静下来。你盯着屏幕，想不出下一句。"
            }
          ],
          "note": "「在吗」不是错，只是把开口的压力又推回给了她。"
        },
        {
          "text": "发「美女，睡了吗？」",
          "delta": -8,
          "tag": "boundary",
          "mood": "sad",
          "next": "c1_chat",
          "reaction": [
            {
              "speaker": "旁白",
              "text": "对话框安静了半小时。"
            },
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "？"
            },
            {
              "speaker": "旁白",
              "text": "你解释了半天，她只回了一个「哦」。"
            }
          ],
          "note": "第一次聊天，称呼和分寸都会被她记住。",
          "fallback": true
        }
      ],
      "custom": {
        "placeholder": "第一条消息，你想发什么？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "怦然心动",
              "签名",
              "梧桐",
              "电影",
              "外公",
              "台词"
            ]
          },
          {
            "option": 1,
            "keys": [
              "在吗",
              "你好",
              "睡了吗",
              "晚上好",
              "在干嘛"
            ]
          },
          {
            "option": 2,
            "keys": [
              "美女",
              "出来玩",
              "约吗",
              "照片",
              "看看你"
            ]
          }
        ],
        "fallback": 1
      },
      "timer": 18
    },
    "c1_chat": {
      "chapter": "ch1",
      "step": 4,
      "background": "dorm-night-boy",
      "narration": "微信 · 22:47",
      "mode": "chat",
      "lines": [
        {
          "speaker": "时间",
          "text": "22:47"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "你也看过那部电影？"
        },
        {
          "speaker": "你",
          "text": "看过。外公那段我记了很久。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "我每年冬天都会重看。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "不过平时……不太跟人聊这些。"
        },
        {
          "speaker": "旁白",
          "text": "她回得很慢，每一句都很短，像在小心地试探。"
        },
        {
          "speaker": "旁白",
          "text": "你想起她抱着书包坐在窗边的样子。屏幕的微光落在天花板上，像一小片月亮。"
        },
        {
          "speaker": "旁白",
          "text": "她的「正在输入」亮了又灭，灭了又亮。"
        }
      ],
      "options": [
        {
          "text": "「那我很荣幸。你不用急着说，我在这儿听着。」",
          "delta": 8,
          "tag": "listening",
          "mood": "shy",
          "next": "c1_gomoku",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……你怎么这么说话。"
            },
            {
              "speaker": "旁白",
              "text": "她发来一个把脸埋进枕头的小人表情。"
            }
          ],
          "note": "害羞的人需要的是不被催促。"
        },
        {
          "text": "「我也喜欢。改天一起看？」",
          "delta": 2,
          "tag": "courage",
          "mood": "normal",
          "next": "c1_gomoku",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "再说吧。"
            },
            {
              "speaker": "旁白",
              "text": "对话没有断，但也没有继续。"
            }
          ],
          "note": "邀约不坏，只是对她来说，还可以再等一等。"
        },
        {
          "text": "「你话这么少，是不是不太会聊天？」",
          "delta": -6,
          "tag": "communication",
          "mood": "sad",
          "next": "c1_gomoku",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "sad",
              "text": "……嗯，可能是吧。"
            },
            {
              "speaker": "旁白",
              "text": "她回完这句，头像暗了下去。"
            }
          ],
          "note": "把她的慢当成缺点，会让她更不敢开口。"
        }
      ],
      "custom": {
        "placeholder": "用你自己的话回复她……",
        "rules": [
          {
            "option": 0,
            "keys": [
              "听着",
              "不急",
              "慢慢",
              "荣幸",
              "不用急",
              "我在"
            ]
          },
          {
            "option": 1,
            "keys": [
              "一起看",
              "改天",
              "再看",
              "看电影"
            ]
          },
          {
            "option": 2,
            "keys": [
              "话少",
              "不会聊",
              "无聊",
              "没意思",
              "太闷",
              "很闷"
            ]
          }
        ],
        "fallback": 1
      }
    },
    "c2_radio": {
      "chapter": "ch2",
      "step": 5,
      "background": "dorm-radio-night",
      "narration": "周三 22:00 · 宿舍",
      "lines": [
        {
          "speaker": "旁白",
          "text": "周三晚上十点，宿舍楼下的公告栏换了新海报。"
        },
        {
          "speaker": "旁白",
          "text": "校园广播台《晚风信箱》，今晚主播：奶龙酱。",
          "learn": [
            "radio"
          ]
        },
        {
          "speaker": "旁白",
          "text": "你这才知道，她每周三都会在广播里读听众来信。"
        },
        {
          "speaker": "旁白",
          "text": "你戴上耳机。她的声音比平时低一点，也慢一点。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "smile",
          "text": "今晚的最后一封信，来自一个不敢开口的人。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "他说，喜欢一个女孩，可每次见到她，只敢说天气。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "我想说，那就从天气说起吧。至少，你已经在和她说话了。"
        },
        {
          "speaker": "旁白",
          "text": "电流的杂音里，她停顿了一下，像是在等谁回答。"
        },
        {
          "speaker": "旁白",
          "text": "你盯着公告栏上的海报看了很久。边角被风掀起，又慢慢落回去。"
        }
      ],
      "options": [
        {
          "text": "发：「你的节目我听完了。那段『从天气说起』，很好。」",
          "delta": 8,
          "tag": "listening",
          "mood": "smile",
          "next": "c2_invite",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "你听到了？"
            },
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……我有点不好意思。不过，谢谢。"
            },
            {
              "speaker": "旁白",
              "text": "她发来一个月亮的表情。"
            }
          ],
          "note": "她没主动说的事，你愿意认真听，本身就是一种靠近。",
          "factHit": true
        },
        {
          "text": "发：「你声音挺好听的。要不要出来吃夜宵？」",
          "delta": 2,
          "tag": "courage",
          "mood": "normal",
          "next": "c2_invite",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "谢谢。不过今天有点累，改天吧。"
            },
            {
              "speaker": "旁白",
              "text": "她回得客气，像把门轻轻带上。"
            }
          ],
          "note": "夸她很好，但夜宵的邀请来得有点突然。"
        },
        {
          "text": "什么也不发，默默点了个赞。",
          "delta": -3,
          "tag": "timing",
          "mood": "normal",
          "next": "c2_invite",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "你听了吗？"
            },
            {
              "speaker": "你",
              "text": "听了。"
            },
            {
              "speaker": "旁白",
              "text": "她过了很久才回：晚安。"
            }
          ],
          "note": "点赞很轻，轻到她不确定你有没有真的听见。"
        }
      ],
      "memoryFact": "radio",
      "custom": {
        "placeholder": "听完节目，你想对她说什么？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "听完",
              "听到",
              "天气说起",
              "节目",
              "很好",
              "月亮"
            ]
          },
          {
            "option": 1,
            "keys": [
              "声音好听",
              "夜宵",
              "出来",
              "吃宵夜",
              "约饭"
            ]
          },
          {
            "option": 2,
            "keys": [
              "点赞",
              "没听",
              "听了",
              "晚安",
              "不说"
            ]
          }
        ],
        "fallback": 1
      }
    },
    "c2_invite": {
      "chapter": "ch2",
      "step": 6,
      "background": "dorm-day-girl",
      "narration": "微信 · 周五 17:20",
      "mode": "chat",
      "lines": [
        {
          "speaker": "时间",
          "text": "周五 17:20"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "高数作业最后一道，你写完了吗？"
        },
        {
          "speaker": "你",
          "text": "写完了。要不要出来吃饭？我顺便讲给你听。"
        },
        {
          "speaker": "旁白",
          "text": "发出去之后，你才想起自己还没想好去哪儿。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "就……我们两个吗？"
        },
        {
          "speaker": "你",
          "text": "嗯。你要是不方便，也可以改天。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "那好吧。不过别点太辣的。"
        },
        {
          "speaker": "旁白",
          "text": "发送前她又补了一句：别迟到。后面跟了一个很小的心虚表情。"
        }
      ],
      "options": [
        {
          "text": "「学校后门那家番茄牛腩，不辣。七点见？」",
          "delta": 10,
          "tag": "detail",
          "mood": "shy",
          "next": "c2_dinner",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……嗯。七点。"
            },
            {
              "speaker": "旁白",
              "text": "她发来一个定位，又补了一句：路上慢点。"
            }
          ],
          "reactionCold": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "好。"
            },
            {
              "speaker": "旁白",
              "text": "她把定位发过来，没有多说。"
            }
          ],
          "note": "不追问、不施压，给她留足退路。"
        },
        {
          "text": "「去吃特辣火锅，练练就好了。」",
          "delta": -8,
          "tag": "boundary",
          "mood": "sad",
          "next": "c2_dinner",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "sad",
              "text": "……我说了别太辣。"
            },
            {
              "speaker": "旁白",
              "text": "她隔了一会儿才回：你定吧。"
            }
          ],
          "note": "她刚说过的边界，不该被一句「练练就好了」推回去。"
        },
        {
          "text": "「随便，你定吧。」",
          "delta": -3,
          "tag": "timing",
          "mood": "normal",
          "next": "c2_dinner",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "那……食堂？"
            },
            {
              "speaker": "旁白",
              "text": "最后你们去了食堂。她全程都在照顾你的口味。"
            }
          ],
          "note": "把选择全推给她，会让害羞的人更累。"
        }
      ],
      "custom": {
        "placeholder": "你想约她去哪里？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "番茄",
              "不辣",
              "七点",
              "后门",
              "可以",
              "牛腩"
            ]
          },
          {
            "option": 1,
            "keys": [
              "特辣",
              "火锅",
              "练练",
              "刺激",
              "无辣不欢"
            ]
          },
          {
            "option": 2,
            "keys": [
              "随便",
              "你定",
              "食堂",
              "都行",
              "无所谓"
            ]
          }
        ],
        "fallback": 1
      }
    },
    "c2_dinner": {
      "chapter": "ch2",
      "step": 7,
      "background": "restaurant",
      "narration": "周五 19:00 · 后门小馆",
      "lines": [
        {
          "speaker": "旁白",
          "text": "周五晚上七点，后门小馆。"
        },
        {
          "speaker": "旁白",
          "text": "她坐在靠窗的位置，书包放在腿上，背挺得很直。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "smile",
          "text": "你真的提前说了不辣。"
        },
        {
          "speaker": "你",
          "text": "老板还问，是不是女朋友不吃辣。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "……老板话真多。"
        },
        {
          "speaker": "旁白",
          "text": "菜上来。她先低头喝了一口汤，动作忽然慢下来。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "这个味道，有点像我家楼下的那家。"
        },
        {
          "speaker": "你",
          "text": "你家在哪儿？"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "成都。",
          "learn": [
            "hometown"
          ]
        },
        {
          "speaker": "旁白",
          "text": "她说着，把碗里的香菜一根一根挑到碟子边。",
          "learn": [
            "taste"
          ]
        },
        {
          "speaker": "旁白",
          "text": "她挑得很认真，像在完成一件很小、但必须做好的事。碟子边很快堆起一小撮绿色。"
        }
      ],
      "options": [
        {
          "text": "「想家的时候，是不是就想喝这一口？」",
          "delta": 8,
          "tag": "listening",
          "mood": "smile",
          "next": "c2_walk",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "smile",
              "text": "嗯。成都这个时候，桂花该开了。"
            },
            {
              "speaker": "旁白",
              "text": "她难得主动多说了两句，眼睛弯起来。"
            }
          ],
          "note": "接住她话里的情绪，比继续问信息更重要。",
          "factHit": true
        },
        {
          "text": "「成都有什么好想的，你不是在这边吗？」",
          "delta": -7,
          "tag": "communication",
          "mood": "sad",
          "next": "c2_walk",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "sad",
              "text": "……也是。"
            },
            {
              "speaker": "旁白",
              "text": "她低头喝汤，没再接着往下说。"
            }
          ],
          "note": "想家不是需要被纠正的情绪。"
        },
        {
          "text": "「对了，我最近打游戏上了王者，跟你说……」",
          "delta": -4,
          "tag": "listening",
          "mood": "normal",
          "next": "c2_walk",
          "reaction": [
            {
              "speaker": "旁白",
              "text": "你讲了十分钟，她一直笑着点头。"
            },
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "……你刚才说到哪儿了？"
            },
            {
              "speaker": "旁白",
              "text": "她碗里的汤已经凉了。"
            }
          ],
          "note": "她在试着说自己，你却把话题接回了自己。"
        }
      ],
      "memoryFact": "hometown",
      "custom": {
        "placeholder": "她说到成都时，你想怎么接？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "想家",
              "桂花",
              "这口",
              "味道",
              "成都"
            ]
          },
          {
            "option": 1,
            "keys": [
              "有什么好想",
              "这边",
              "别想",
              "至于",
              "矫情"
            ]
          },
          {
            "option": 2,
            "keys": [
              "打游戏",
              "王者",
              "我跟你说",
              "游戏",
              "上分"
            ]
          }
        ],
        "fallback": 2
      }
    },
    "c2_walk": {
      "chapter": "ch2",
      "step": 8,
      "background": "walk",
      "narration": "周五 20:15 · 学校后门",
      "lines": [
        {
          "speaker": "旁白",
          "text": "夜风里有一点桂花味。她站在路灯下，没有急着走。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "smile",
          "text": "今天谢谢你。番茄牛腩很好吃。"
        },
        {
          "speaker": "旁白",
          "text": "她低头看了一眼手机，又收起来。"
        },
        {
          "speaker": "旁白",
          "text": "像是还有什么话，没说出口。"
        },
        {
          "speaker": "旁白",
          "text": "路灯把两个人的影子拉在身后。她的鞋尖轻轻碾着一片落叶。"
        },
        {
          "speaker": "旁白",
          "text": "路口的奶茶店还亮着，暖黄的灯从玻璃里透出来。"
        }
      ],
      "options": [
        {
          "text": "「刚才你说成都的桂花。下次想家，我带你去吃甜水面？」",
          "delta": 8,
          "tag": "listening",
          "mood": "smile",
          "next": "c2_confession_talk",
          "factKey": "hometown",
          "factHit": true,
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……你还记得。"
            },
            {
              "speaker": "旁白",
              "text": "她低头踢了踢石子，声音很轻：那你要说话算话。"
            }
          ],
          "note": "把刚才听见的事，轻轻放回她手里。"
        },
        {
          "text": "「时间还早。要不要沿操场走一圈？」",
          "delta": 6,
          "tag": "timing",
          "mood": "smile",
          "next": "c2_confession_talk",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "smile",
              "text": "好啊。不过你走慢一点。"
            },
            {
              "speaker": "旁白",
              "text": "路灯把两个人的影子拉长，又在脚下叠在一起。"
            }
          ],
          "note": "不急着结束约会，也不急着推进关系。"
        },
        {
          "text": "「去我宿舍坐坐？就我一个人。」",
          "delta": -6,
          "tag": "boundary",
          "mood": "surprised",
          "next": "c2_confession_talk",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "surprised",
              "text": "……不太好吧。"
            },
            {
              "speaker": "旁白",
              "text": "她往后退了半步。你赶紧说开玩笑的，她才慢慢跟上来。"
            }
          ],
          "note": "第一次约会后的邀请，越过了她还没准备好的距离。"
        }
      ],
      "custom": {
        "placeholder": "送她回去的路上，你想说什么？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "甜水面",
              "成都",
              "桂花",
              "想家",
              "记得"
            ]
          },
          {
            "option": 1,
            "keys": [
              "走一圈",
              "操场",
              "散步",
              "走走",
              "还早",
              "慢慢走"
            ]
          },
          {
            "option": 2,
            "keys": [
              "宿舍",
              "一个人",
              "上去",
              "坐坐",
              "去你那"
            ]
          }
        ],
        "fallback": 1
      }
    },
    "c2_confession_talk": {
      "chapter": "ch2",
      "step": 9,
      "background": "walk",
      "narration": "操场 · 第三圈",
      "lines": [
        {
          "speaker": "旁白",
          "text": "操场，第三圈。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "广播台经常收到一种信。"
        },
        {
          "speaker": "你",
          "text": "什么信？"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "在操场摆蜡烛、拉横幅，问要不要答应的那种。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "有一次来信的女生说，她当时只想找条地缝钻进去。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "我念完那封信，就在想……喜欢为什么非要让那么多人看。"
        },
        {
          "speaker": "旁白",
          "text": "她说完，低头看着自己的鞋尖。",
          "learn": [
            "confession"
          ]
        },
        {
          "speaker": "旁白",
          "text": "你忽然明白，她不是在讲别人的故事。"
        },
        {
          "speaker": "旁白",
          "text": "操场的路灯一盏一盏亮起来，把两个人的影子拉得很长。"
        },
        {
          "speaker": "旁白",
          "text": "风从看台那边吹过来，她拢了拢头发，没有再说下去。"
        }
      ],
      "options": [
        {
          "text": "「那如果有一天，有人只对你一个人说呢？」",
          "delta": 8,
          "tag": "boundary",
          "mood": "shy",
          "next": "c3_weekend",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……那我可能会听他把话说完。"
            },
            {
              "speaker": "旁白",
              "text": "她没抬头，耳尖却红了。"
            }
          ],
          "note": "听见她没有说出口的那句话，也守住她想要的安静。",
          "factHit": true
        },
        {
          "text": "「那多没面子啊，表白就得热热闹闹的。」",
          "delta": -8,
          "tag": "boundary",
          "mood": "sad",
          "next": "c3_weekend",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "sad",
              "text": "……那可能是我们想的不太一样。"
            },
            {
              "speaker": "旁白",
              "text": "她把外套拉紧，脚步快了一些。"
            }
          ],
          "note": "她刚说完不喜欢被围观，你却在替围观说话。"
        },
        {
          "text": "「哈哈，我随便问问。」",
          "delta": -3,
          "tag": "communication",
          "mood": "normal",
          "next": "c3_weekend",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "哦。"
            },
            {
              "speaker": "旁白",
              "text": "她笑了一下，没再继续这个话题。"
            }
          ],
          "note": "她把话递到你面前，你却用玩笑推开了。"
        }
      ],
      "memoryFact": "confession",
      "custom": {
        "placeholder": "听到她的想法，你会怎么回应？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "一个人",
              "只听",
              "私下",
              "安静",
              "没有观众",
              "两个人"
            ]
          },
          {
            "option": 1,
            "keys": [
              "热闹",
              "蜡烛",
              "人多",
              "面子",
              "横幅",
              "摆蜡烛"
            ]
          },
          {
            "option": 2,
            "keys": [
              "随便问问",
              "随口",
              "哈哈",
              "问问",
              "没什么"
            ]
          }
        ],
        "fallback": 2
      }
    },
    "c3_weekend": {
      "chapter": "ch3",
      "step": 10,
      "background": "dorm-day-girl",
      "narration": "微信 · 周六 09:12",
      "mode": "chat",
      "lines": [
        {
          "speaker": "时间",
          "text": "周六 09:12"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "今天有空吗？"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "不想一直待在宿舍。"
        },
        {
          "speaker": "你",
          "text": "有。你想去哪儿？"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "你定吧。别太远就好。"
        },
        {
          "speaker": "旁白",
          "text": "这是她第一次主动约你。"
        },
        {
          "speaker": "旁白",
          "text": "窗外的阳光很好。你把手机放进口袋，又拿出来确认了一遍时间。"
        }
      ],
      "options": [
        {
          "text": "「去看电影吧。《怦然心动》这周重映。」",
          "delta": 6,
          "tag": "courage",
          "mood": "smile",
          "next": "c3_movie",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "smile",
              "text": "你怎么知道我想看这个。"
            },
            {
              "speaker": "旁白",
              "text": "她发来一个愣住的表情，又很快补了一句：那我去换衣服。"
            }
          ],
          "note": "把她藏在签名里的喜欢，变成一次不用解释的邀约。"
        },
        {
          "text": "「去夜市逛逛？听说新开了一条小吃街。」",
          "delta": 6,
          "tag": "action",
          "mood": "smile",
          "next": "c3_shopping",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "smile",
              "text": "好呀。不过你要负责帮我拿东西。"
            },
            {
              "speaker": "旁白",
              "text": "她发来一个得意的表情。"
            }
          ],
          "note": "热闹的地方，也可以慢慢走。"
        },
        {
          "text": "「一起去图书馆吧，把高数补一补。」",
          "delta": 6,
          "tag": "timing",
          "mood": "normal",
          "next": "c3_library",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "……你约女生去自习？"
            },
            {
              "speaker": "旁白",
              "text": "行吧，看在你高数好的份上。"
            }
          ],
          "note": "图书馆是她觉得安全的地方。"
        }
      ],
      "custom": {
        "placeholder": "你想带她去哪里？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "电影",
              "怦然心动",
              "重映",
              "看片",
              "影院"
            ]
          },
          {
            "option": 1,
            "keys": [
              "夜市",
              "小吃",
              "逛逛",
              "逛街",
              "小吃街"
            ]
          },
          {
            "option": 2,
            "keys": [
              "图书馆",
              "自习",
              "高数",
              "学习",
              "补课"
            ]
          }
        ],
        "fallback": 1
      }
    },
    "c3_movie": {
      "chapter": "ch3",
      "step": 11,
      "background": "cinema",
      "narration": "周六 15:00 · 电影院",
      "lines": [
        {
          "speaker": "旁白",
          "text": "周六下午，电影院。她抱着爆米花，坐得很直。"
        },
        {
          "speaker": "旁白",
          "text": "电影放到外公在院子里种树那一段。你听见旁边很轻的吸鼻子声。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "……我没哭。是爆米花太辣了。"
        },
        {
          "speaker": "旁白",
          "text": "散场后，她还抱着那桶没吃完的爆米花。"
        },
        {
          "speaker": "旁白",
          "text": "海报墙的光灭了又亮。她把爆米花桶抱得更紧了一点。"
        }
      ],
      "options": [
        {
          "text": "「外公种树那一段，你是不是看哭了？」",
          "delta": 8,
          "tag": "listening",
          "mood": "shy",
          "next": "c3_weekend_end",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……都说了是爆米花太辣。"
            },
            {
              "speaker": "奶龙酱",
              "mood": "smile",
              "text": "不过，那一段我每次看都会哭。"
            },
            {
              "speaker": "旁白",
              "text": "她把爆米花往你怀里一塞，自己先笑了。"
            }
          ],
          "note": "不拆穿她的逞强，只把她不好意思说的那部分轻轻接住。",
          "factHit": true
        },
        {
          "text": "「这电影节奏也太慢了，我都快睡着了。」",
          "delta": -6,
          "tag": "communication",
          "mood": "sad",
          "next": "c3_weekend_end",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "sad",
              "text": "……是吗。"
            },
            {
              "speaker": "旁白",
              "text": "她抱着爆米花走在前面，脚步快了一点。"
            }
          ],
          "note": "这是她每年冬天都会重看的电影。"
        },
        {
          "text": "一路上低头回消息，散场后才问她电影讲了什么。",
          "delta": -5,
          "tag": "listening",
          "mood": "normal",
          "next": "c3_weekend_end",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "你自己看吧，我先回去了。"
            },
            {
              "speaker": "旁白",
              "text": "她说完又停了一下，像在等你说点什么。"
            }
          ],
          "note": "她坐在你旁边，却没有真正被看见。"
        }
      ],
      "memoryFact": "movie",
      "custom": {
        "placeholder": "散场后，你想对她说……",
        "rules": [
          {
            "option": 0,
            "keys": [
              "看哭",
              "哭了",
              "外公",
              "种树",
              "那段",
              "爆米花",
              "感动"
            ]
          },
          {
            "option": 1,
            "keys": [
              "太慢",
              "节奏慢",
              "睡着",
              "无聊",
              "不好看",
              "没意思"
            ]
          },
          {
            "option": 2,
            "keys": [
              "回消息",
              "手机",
              "没看",
              "讲了什么",
              "走神"
            ]
          }
        ],
        "fallback": 2
      }
    },
    "c3_shopping": {
      "chapter": "ch3",
      "step": 11,
      "background": "street",
      "narration": "周六 18:30 · 夜市",
      "lines": [
        {
          "speaker": "旁白",
          "text": "周六傍晚，夜市。灯串一盏一盏亮起来。"
        },
        {
          "speaker": "旁白",
          "text": "她在一家奶茶摊前停下，又往前走。"
        },
        {
          "speaker": "你",
          "text": "不买一杯？"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "……人有点多。"
        },
        {
          "speaker": "旁白",
          "text": "她回头看了一眼，小声对老板说：「三分糖，芋泥。」",
          "learn": [
            "drink"
          ]
        },
        {
          "speaker": "旁白",
          "text": "旁边的小摊挂着一只绿色的毛绒小龙。她看了两秒，收回视线。"
        },
        {
          "speaker": "旁白",
          "text": "奶茶摊的灯串映在她眼睛里，像一小串星星。"
        }
      ],
      "options": [
        {
          "text": "先去买一杯三分糖芋泥奶茶，再折回去把那只小龙买下来。",
          "delta": 8,
          "tag": "detail",
          "mood": "surprised",
          "next": "c3_weekend_end",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "surprised",
              "text": "你连三分糖都听见了？"
            },
            {
              "speaker": "旁白",
              "text": "她抱着小龙和奶茶，嘴角一直没压下去。"
            },
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……今天先欠你一次。"
            }
          ],
          "note": "她没说出口的喜欢，你都听见了。",
          "factHit": true
        },
        {
          "text": "给自己买一杯全糖，顺手问她要不要。",
          "delta": -4,
          "tag": "detail",
          "mood": "normal",
          "next": "c3_weekend_end",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "不用了，我喝不了太甜。"
            },
            {
              "speaker": "旁白",
              "text": "她看了看你手里的全糖奶茶，没再说什么。"
            }
          ],
          "note": "「顺手」两个字，抵掉了她刚刚小声说出的偏好。"
        },
        {
          "text": "催她快点走，说商场快关门了。",
          "delta": -6,
          "tag": "timing",
          "mood": "sad",
          "next": "c3_weekend_end",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "sad",
              "text": "哦，好。"
            },
            {
              "speaker": "旁白",
              "text": "她放下毛绒小龙，跟在你后面，没再停在任何一个摊位前。"
            }
          ],
          "note": "她难得停下来看一样东西。"
        }
      ],
      "memoryFact": "drink",
      "custom": {
        "placeholder": "看见她停在奶茶摊前，你会……",
        "rules": [
          {
            "option": 0,
            "keys": [
              "三分糖",
              "芋泥",
              "小龙",
              "奶茶",
              "毛绒",
              "买奶茶"
            ]
          },
          {
            "option": 1,
            "keys": [
              "全糖",
              "太甜",
              "问要不要",
              "自己买",
              "顺手"
            ]
          },
          {
            "option": 2,
            "keys": [
              "快点",
              "关门",
              "催她",
              "走了",
              "来不及"
            ]
          }
        ],
        "fallback": 1
      }
    },
    "c3_library": {
      "chapter": "ch3",
      "step": 11,
      "background": "library",
      "narration": "周六 19:30 · 图书馆",
      "lines": [
        {
          "speaker": "旁白",
          "text": "周六晚上，图书馆。你们占到一张靠窗的桌子。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "sad",
          "text": "这道题我又卡住了。是不是我真的很笨？"
        },
        {
          "speaker": "你",
          "text": "不是。你只是还没找到自己习惯的那一步。"
        },
        {
          "speaker": "旁白",
          "text": "你陪她把同一道题重新推了一遍。写到一半，她的肚子叫了一声。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "……点个外卖吧。我请。"
        },
        {
          "speaker": "旁白",
          "text": "她趴在桌上，把脸转向窗外。图书馆的灯很白，把她的侧脸照得很安静。"
        }
      ],
      "options": [
        {
          "text": "点外卖时备注：微辣，两份都不要香菜。",
          "delta": 8,
          "tag": "detail",
          "mood": "surprised",
          "next": "c3_weekend_end",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "surprised",
              "text": "你连这个都记得。"
            },
            {
              "speaker": "旁白",
              "text": "她看着备注栏，笑了一下。"
            },
            {
              "speaker": "奶龙酱",
              "mood": "smile",
              "text": "那我以后是不是可以放心把点单交给你了？"
            }
          ],
          "note": "她挑掉香菜的动作，被你看在了眼里。",
          "factHit": true
        },
        {
          "text": "点两份特辣麻辣烫，说吃辣才提神。",
          "delta": -6,
          "tag": "detail",
          "mood": "sad",
          "next": "c3_weekend_end",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "sad",
              "text": "……我吃不了这个。"
            },
            {
              "speaker": "旁白",
              "text": "她把自己那份推到一边，去接了一杯热水。"
            }
          ],
          "note": "她晚饭时挑掉的不只是香菜，还有辣。"
        },
        {
          "text": "只点自己的，让她自己决定。",
          "delta": -3,
          "tag": "action",
          "mood": "normal",
          "next": "c3_weekend_end",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "……好，我自己来。"
            },
            {
              "speaker": "旁白",
              "text": "她低头点单，屏幕的光照在脸上，安静得有点陌生。"
            }
          ],
          "note": "体贴也包括主动分担选择，而不是把事都推回去。"
        }
      ],
      "memoryFact": "taste",
      "custom": {
        "placeholder": "外卖备注，你会怎么写？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "不要香菜",
              "微辣",
              "两份",
              "备注",
              "香菜",
              "记得"
            ]
          },
          {
            "option": 1,
            "keys": [
              "特辣",
              "麻辣烫",
              "吃辣",
              "提神",
              "重辣"
            ]
          },
          {
            "option": 2,
            "keys": [
              "自己点",
              "只点",
              "不管",
              "自己来",
              "随意"
            ]
          }
        ],
        "fallback": 2
      }
    },
    "c3_weekend_end": {
      "chapter": "ch3",
      "step": null,
      "background": "campus",
      "narration": "周日 17:40 · 校门口",
      "lines": [
        {
          "speaker": "旁白",
          "text": "周日傍晚，你们从约会的地方往回走。校门口新贴了一张游乐园的海报。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "摩天轮。"
        },
        {
          "speaker": "你",
          "text": "想坐？"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "我有点怕高。不过升到最高的时候，夜景应该很好看。",
          "learn": [
            "heights"
          ]
        },
        {
          "speaker": "旁白",
          "text": "她往前走了两步，又停下来，看旁边水族馆的宣传画。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "smile",
          "text": "水母像会呼吸的灯。"
        },
        {
          "speaker": "旁白",
          "text": "她没有说想去，但你记住了。",
          "learn": [
            "aquarium"
          ]
        },
        {
          "speaker": "旁白",
          "text": "夕阳把她的侧脸照得很软。"
        },
        {
          "speaker": "旁白",
          "text": "你低头看手里的票根，她在旁边小声哼歌。风把她的声音吹散了一半。"
        }
      ],
      "options": [],
      "next": "c3_rain"
    },
    "c3_rain": {
      "chapter": "ch4",
      "step": 12,
      "background": "rain",
      "narration": "两周后 · 图书馆门口 · 暴雨",
      "lines": [
        {
          "speaker": "旁白",
          "text": "两周后，图书馆门口，暴雨。"
        },
        {
          "speaker": "旁白",
          "text": "你撑着伞走过去，看见她抱着一摞书站在檐下。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "sad",
          "text": "我出门的时候还是晴天……"
        },
        {
          "speaker": "旁白",
          "text": "雷声从远处滚过来。她下意识缩了缩肩，往柱子那边靠了靠。",
          "effect": "flash"
        },
        {
          "speaker": "你",
          "text": "怕打雷？"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "……有一点。小时候一个人在家，被吓到过。",
          "learn": [
            "thunder"
          ]
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "你先走吧，我等雨小一点。"
        },
        {
          "speaker": "旁白",
          "text": "雨点砸在台阶上，溅起细小的水花。她的裤脚湿了一截，抱着书的手指有点发白。"
        },
        {
          "speaker": "旁白",
          "text": "风把雨丝吹斜，伞面轻轻抖了一下。远处又滚过一声闷雷。"
        }
      ],
      "options": [
        {
          "text": "把伞往她那边倾：「一起走吧，我先送你到楼下。」",
          "delta": 8,
          "tag": "action",
          "mood": "shy",
          "next": "c3_thunder",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "那你肩膀会湿。"
            },
            {
              "speaker": "你",
              "text": "没事。"
            },
            {
              "speaker": "旁白",
              "text": "她犹豫了一下，往伞下挪了半步。"
            }
          ],
          "reactionCold": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……不用了，我等雨停。"
            },
            {
              "speaker": "旁白",
              "text": "她抱着书往柱子后面退了退。你在檐下站了一会儿，才把伞收起来。"
            }
          ],
          "note": "关心要具体，也要允许她说不用。",
          "factHit": true
        },
        {
          "text": "把伞塞给她，自己冲进雨里：「你打伞，我跑回去！」",
          "delta": 4,
          "tag": "action",
          "mood": "normal",
          "next": "c3_thunder",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "surprised",
              "text": "你傻不傻啊！"
            },
            {
              "speaker": "旁白",
              "text": "她追出两步，又停下来。你听见她在雨里喊：明天记得喝感冒药。"
            }
          ],
          "note": "把伞全给她很勇敢，但一起走才是她更需要的陪伴。"
        },
        {
          "text": "搂住她的肩往雨里走：「别等了，一起冲！」",
          "delta": -7,
          "tag": "boundary",
          "mood": "surprised",
          "next": "c3_thunder",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "surprised",
              "text": "你干嘛——"
            },
            {
              "speaker": "旁白",
              "text": "她挣了一下，往旁边躲开。雨落在你们中间。"
            },
            {
              "speaker": "奶龙酱",
              "mood": "sad",
              "text": "……我自己走。"
            }
          ],
          "note": "她没有允许你碰她。雨再大，也不是越界的理由。"
        }
      ],
      "memoryFact": "thunder",
      "custom": {
        "placeholder": "她怕打雷，你会怎么做？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "一起走",
              "送你",
              "打伞",
              "撑伞",
              "楼下",
              "慢慢"
            ]
          },
          {
            "option": 1,
            "keys": [
              "跑回去",
              "给你伞",
              "不用管",
              "自己跑"
            ]
          },
          {
            "option": 2,
            "keys": [
              "搂住",
              "抱住",
              "拉她",
              "拽她",
              "别等",
              "一起冲"
            ]
          }
        ],
        "fallback": 1
      }
    },
    "c3_thunder": {
      "chapter": "ch4",
      "step": 13,
      "background": "dorm-storm-girl",
      "narration": "当晚 23:40 · 宿舍",
      "lines": [
        {
          "speaker": "旁白",
          "text": "当晚十一点四十，宿舍。"
        },
        {
          "speaker": "旁白",
          "text": "雨又大了。一道闪电过后，宿舍楼跳了一下闸，又很快恢复。"
        },
        {
          "speaker": "旁白",
          "text": "手机亮了。是她。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "你睡了吗？"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "刚才那声雷好响。"
        },
        {
          "speaker": "旁白",
          "text": "你几乎能想象出她把被子拉到下巴、手机贴在耳边的样子。"
        },
        {
          "speaker": "旁白",
          "text": "窗外的雨敲在空调外机上，一下，又一下。"
        }
      ],
      "options": [
        {
          "text": "「还没。要不要我陪你聊一会儿？你不想说也没关系。」",
          "delta": 8,
          "tag": "listening",
          "mood": "shy",
          "next": "c3_goodnight",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "好。"
            },
            {
              "speaker": "旁白",
              "text": "她断断续续地讲小时候的事。你偶尔接一句，更多的时候只是听着。"
            },
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……有你在，好像没那么怕了。"
            }
          ],
          "reactionCold": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "会不会太麻烦你。"
            },
            {
              "speaker": "旁白",
              "text": "她发来这一句，又很快补上：算了，你不用管我。"
            }
          ],
          "note": "陪伴不是替她消灭恐惧，而是让她不用一个人面对。",
          "factHit": true
        },
        {
          "text": "「打雷有什么好怕的，又不是小孩子了。」",
          "delta": -8,
          "tag": "listening",
          "mood": "sad",
          "next": "c3_goodnight",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "sad",
              "text": "……也是。"
            },
            {
              "speaker": "旁白",
              "text": "对话框安静下来。过了一会儿，她发来一句：我睡了，晚安。"
            }
          ],
          "note": "她鼓起勇气才发出的消息，被一句嘲笑堵了回去。"
        },
        {
          "text": "「早点睡，睡着就听不见了。」",
          "delta": -4,
          "tag": "action",
          "mood": "normal",
          "next": "c3_goodnight",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "嗯，晚安。"
            },
            {
              "speaker": "旁白",
              "text": "你盯着对话框看了一会儿，觉得好像还可以再说点什么，但最终什么也没发。"
            }
          ],
          "note": "给了办法，却没有接住她的情绪。"
        }
      ],
      "memoryFact": "thunder",
      "custom": {
        "placeholder": "深夜，她发来一句「雷好响」……",
        "rules": [
          {
            "option": 0,
            "keys": [
              "陪你",
              "聊一会",
              "不想说",
              "我在",
              "没关系",
              "听你"
            ]
          },
          {
            "option": 1,
            "keys": [
              "有什么好怕",
              "小孩子",
              "别怕",
              "怕什么",
              "矫情"
            ]
          },
          {
            "option": 2,
            "keys": [
              "早点睡",
              "睡着",
              "晚安",
              "睡吧",
              "快睡"
            ]
          }
        ],
        "fallback": 2
      }
    },
    "c3_goodnight": {
      "chapter": "ch4",
      "step": 14,
      "background": "dorm-night-girl",
      "narration": "微信 · 次日 00:20",
      "mode": "chat",
      "lines": [
        {
          "speaker": "时间",
          "text": "次日 00:20"
        },
        {
          "speaker": "旁白",
          "text": "雨声小下去。她打了个哈欠，发来一个困倦的表情。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "我有点困了。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "明天还有早八。"
        },
        {
          "speaker": "旁白",
          "text": "窗帘没有拉严，月光从缝里漏进来，落在被角上。"
        }
      ],
      "options": [
        {
          "text": "「你的兔子耳朵……是自己缝的吧？缝得歪，但看得出来很用心。」",
          "delta": 10,
          "tag": "detail",
          "mood": "surprised",
          "requires": [
            "girl_bunny"
          ],
          "next": "c4_place",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……你怎么看出来的。"
            },
            {
              "speaker": "旁白",
              "text": "她把兔子往怀里收了收，耳朵尖有点红。"
            }
          ],
          "note": "你注意到了她修补过的玩偶——这比夸她可爱更让她意外。"
        },
        {
          "text": "「那你快睡。明天早上我叫你，起不来就罚你请我喝奶茶。」",
          "delta": 8,
          "tag": "timing",
          "mood": "smile",
          "next": "c4_place",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "smile",
              "text": "那可是你说的。"
            },
            {
              "speaker": "旁白",
              "text": "晚安。"
            },
            {
              "speaker": "旁白",
              "text": "第二天早上，她真的发来一张在教室占座的照片。"
            }
          ],
          "note": "把关心落到明天，也把选择留在她手里。"
        },
        {
          "text": "「再聊会儿嘛，我还不困。」",
          "delta": -7,
          "tag": "boundary",
          "mood": "sad",
          "next": "c4_place",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "sad",
              "text": "……我真的困了。"
            },
            {
              "speaker": "旁白",
              "text": "她回得很慢，最后只发了一个晚安。"
            }
          ],
          "note": "她已经说了困，再挽留就是把自己的需要放在她前面。"
        },
        {
          "text": "「好，晚安。」",
          "delta": 2,
          "tag": "timing",
          "mood": "normal",
          "next": "c4_place",
          "reaction": [
            {
              "speaker": "旁白",
              "text": "你放下手机，又拿起来，补了一句：今晚辛苦了。"
            },
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "你也辛苦。晚安。"
            }
          ],
          "note": "好好道晚安，也是一种温柔的收尾。",
          "fallback": true
        }
      ],
      "custom": {
        "placeholder": "她困了，你想怎么回？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "快睡",
              "叫你",
              "奶茶",
              "晚安",
              "明天",
              "起床"
            ]
          },
          {
            "option": 1,
            "keys": [
              "再聊",
              "不困",
              "别睡",
              "陪我",
              "再一会"
            ]
          },
          {
            "option": 2,
            "keys": [
              "晚安",
              "睡吧",
              "辛苦了",
              "你先睡"
            ]
          }
        ],
        "fallback": 2
      },
      "timer": 15
    },
    "c4_place": {
      "chapter": "ch5",
      "step": 15,
      "background": "campus",
      "narration": "期末周结束 · 周五傍晚",
      "lines": [
        {
          "speaker": "旁白",
          "text": "期末周结束后的周五，你站在宿舍楼下，手里攥着两张票。"
        },
        {
          "speaker": "旁白",
          "text": "手机里躺着三条路线：学校的操场、游乐园的摩天轮、市中心的水族馆。"
        },
        {
          "speaker": "旁白",
          "text": "你想起这段时间她说过的话。"
        },
        {
          "speaker": "旁白",
          "text": "有些喜欢，不需要让全世界知道。"
        },
        {
          "speaker": "旁白",
          "text": "风把梧桐叶吹得沙沙响。你把票根抚平，又攥紧。"
        },
        {
          "speaker": "旁白",
          "text": "手机屏幕亮了一下，是她发来的：在干嘛？"
        }
      ],
      "options": [
        {
          "text": "操场。没有观众，只有晚风。",
          "delta": 8,
          "tag": "boundary",
          "mood": "shy",
          "next": "c4_track",
          "reaction": [
            {
              "speaker": "旁白",
              "text": "你给她发消息：今晚七点，操场见。"
            },
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "好。你最好别迟到。"
            }
          ],
          "note": "她说过，喜欢不需要让那么多人看。"
        },
        {
          "text": "摩天轮。她怕高，却想看一次最高处的夜景。",
          "delta": 6,
          "tag": "detail",
          "mood": "shy",
          "next": "c4_ferris",
          "factKey": "heights",
          "factHit": true,
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "摩天轮？我有点怕高。"
            },
            {
              "speaker": "奶龙酱",
              "mood": "smile",
              "text": "……不过你还记得我想看夜景。那好吧。"
            }
          ],
          "note": "她怕高，但没有说不想去。"
        },
        {
          "text": "水族馆。蓝色，安静，像她提过的那样。",
          "delta": 6,
          "tag": "detail",
          "mood": "smile",
          "next": "c4_aquarium",
          "factKey": "aquarium",
          "factHit": true,
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "smile",
              "text": "你真的记住了。"
            },
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "那我提前说好，我不看鲨鱼。"
            }
          ],
          "note": "她只说过一句「水母像会呼吸的灯」。"
        }
      ],
      "custom": {
        "placeholder": "今晚，你想带她去哪里？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "操场",
              "晚风",
              "没有观众",
              "安静",
              "两个人",
              "跑道"
            ]
          },
          {
            "option": 1,
            "keys": [
              "摩天轮",
              "夜景",
              "怕高",
              "最高",
              "游乐园"
            ]
          },
          {
            "option": 2,
            "keys": [
              "水族馆",
              "蓝色",
              "水母",
              "安静"
            ]
          }
        ],
        "fallback": 0
      }
    },
    "c4_track": {
      "chapter": "ch5",
      "step": 16,
      "background": "track",
      "narration": "晚上 19:00 · 操场",
      "location": "track",
      "lines": [
        {
          "speaker": "旁白",
          "text": "操场上的灯只开了一半，跑道上没什么人。"
        },
        {
          "speaker": "旁白",
          "text": "她穿着那件浅色外套，站在看台下面等你。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "神神秘秘的。"
        },
        {
          "speaker": "你",
          "text": "想找个安静的地方，跟你说件事。"
        },
        {
          "speaker": "旁白",
          "text": "你们沿着跑道慢慢走。走完一圈，你停下来。"
        },
        {
          "speaker": "你",
          "text": "奶龙酱，我喜欢你。不是一时兴起。是这段时间里，我越来越想听你说话，想记住你说的每一件小事。"
        },
        {
          "speaker": "旁白",
          "text": "她愣在原地。风把她的头发吹到脸边，她没有伸手去拨。"
        },
        {
          "speaker": "旁白",
          "text": "远处的教学楼还亮着几扇窗，像有人也在等一个答案。"
        },
        {
          "speaker": "旁白",
          "text": "跑道边的灯把两个人的影子叠在一起，又被风吹开。"
        }
      ],
      "options": [
        {
          "text": "安静地告诉她：「你不用现在回答。我喜欢你，也尊重你的节奏。」",
          "delta": 8,
          "tag": "boundary",
          "mood": "shy",
          "finalTone": "respectful",
          "next": "",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……你这个人，怎么连表白都这么会给人留退路。"
            },
            {
              "speaker": "旁白",
              "text": "她低头笑了一下，眼睛有点亮。操场的风把她的声音吹得很轻。"
            }
          ],
          "reactionCold": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……你让我想一想。"
            },
            {
              "speaker": "旁白",
              "text": "她把手缩进袖子里，过了很久才小声说：谢谢你没有逼我。"
            }
          ],
          "note": "喜欢是说出口，不是要一个立刻的答案。"
        },
        {
          "text": "让室友把蜡烛和音响搬到操场，当众表白。",
          "delta": -10,
          "tag": "boundary",
          "mood": "surprised",
          "flag": "overstep",
          "finalTone": "pushy",
          "next": "",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "surprised",
              "text": "……你叫了这么多人？"
            },
            {
              "speaker": "旁白",
              "text": "她往后退了半步，笑容僵在脸上。"
            }
          ],
          "note": "她说过不想要观众。你把整个操场变成了观众席。"
        },
        {
          "text": "把写好的纸条塞给她，转身就走。",
          "delta": -6,
          "tag": "communication",
          "mood": "sad",
          "finalTone": "withdraw",
          "next": "",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "sad",
              "text": "……你去哪儿？"
            },
            {
              "speaker": "旁白",
              "text": "你没有回头。她的声音被风吹散在跑道上。"
            }
          ],
          "note": "把话说完，也留在原地听她的回答。"
        }
      ],
      "custom": {
        "placeholder": "在只说给她一个人听的夜里，你想怎么表白？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "不用回答",
              "尊重",
              "节奏",
              "慢慢",
              "不着急",
              "喜欢",
              "认真"
            ]
          },
          {
            "option": 1,
            "keys": [
              "蜡烛",
              "室友",
              "当众",
              "音响",
              "观众",
              "起哄"
            ]
          },
          {
            "option": 2,
            "keys": [
              "纸条",
              "转身",
              "转身走",
              "塞给她"
            ]
          }
        ],
        "fallback": 0
      }
    },
    "c4_ferris": {
      "chapter": "ch5",
      "step": 16,
      "background": "ferris",
      "narration": "晚上 19:30 · 摩天轮",
      "location": "ferris",
      "lines": [
        {
          "speaker": "旁白",
          "text": "游乐园的灯全亮了。摩天轮慢慢转着，像一只巨大的、发光的钟。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "我先说好，如果升到一半我害怕，你要让我抓住你的袖子。"
        },
        {
          "speaker": "你",
          "text": "好。你要不要现在就抓着？"
        },
        {
          "speaker": "旁白",
          "text": "她瞪了你一眼，还是把手轻轻搭在你的袖口上。"
        },
        {
          "speaker": "旁白",
          "text": "轿厢升到最高处时，整座城市的灯都在脚下。她看了一会儿，忽然转过头。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "normal",
          "text": "你今天带我来这里，是不是有话要说？"
        },
        {
          "speaker": "你",
          "text": "嗯。奶龙酱，我喜欢你。"
        },
        {
          "speaker": "旁白",
          "text": "轿厢很安静。她的手还搭在你的袖口上，没有松开。"
        },
        {
          "speaker": "旁白",
          "text": "远处的地面越来越小，城市的灯在脚下一圈一圈铺开，像谁把星星撒在了地上。"
        },
        {
          "speaker": "旁白",
          "text": "摩天轮还在慢慢转。你听见她轻轻吸了一口气。"
        }
      ],
      "options": [
        {
          "text": "先问她：「你还好吗？」等她点头，再慢慢把喜欢说完整。",
          "delta": 8,
          "tag": "boundary",
          "mood": "shy",
          "finalTone": "respectful",
          "next": "",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……我本来有点怕。"
            },
            {
              "speaker": "奶龙酱",
              "mood": "smile",
              "text": "但你一直在这里，好像也没那么怕了。"
            },
            {
              "speaker": "旁白",
              "text": "她没有抽回手。窗外的灯一盏一盏往后退。"
            }
          ],
          "note": "她的害怕，和你喜欢她一样重要。"
        },
        {
          "text": "让工作人员在摩天轮下摆一圈蜡烛，等你们下来时起哄。",
          "delta": -10,
          "tag": "boundary",
          "mood": "surprised",
          "flag": "overstep",
          "finalTone": "pushy",
          "next": "",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "surprised",
              "text": "……你不是说，只有我们两个人吗？"
            },
            {
              "speaker": "旁白",
              "text": "她松开你的袖口，往人群外面走。"
            }
          ],
          "note": "她答应上来，是因为以为这一刻只属于你们两个人。"
        },
        {
          "text": "拿出手机，让她看一段你写了很久的微信长文。",
          "delta": -5,
          "tag": "communication",
          "mood": "normal",
          "finalTone": "withdraw",
          "next": "",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "……你都在我面前了，为什么还要我看手机？"
            },
            {
              "speaker": "旁白",
              "text": "她把手机推回来，轿厢里只剩下摩天轮转动的声音。"
            }
          ],
          "note": "信可以写，但喜欢要看着她的眼睛说。"
        }
      ],
      "custom": {
        "placeholder": "在最高处的轿厢里，你想说什么？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "还好吗",
              "尊重",
              "慢慢说",
              "不着急",
              "喜欢",
              "牵着",
              "我在"
            ]
          },
          {
            "option": 1,
            "keys": [
              "蜡烛",
              "工作人员",
              "起哄",
              "当众",
              "惊喜",
              "摆一圈"
            ]
          },
          {
            "option": 2,
            "keys": [
              "手机",
              "长文",
              "微信",
              "发给你",
              "看这个"
            ]
          }
        ],
        "fallback": 0
      }
    },
    "c4_aquarium": {
      "chapter": "ch5",
      "step": 16,
      "background": "aquarium",
      "narration": "晚上 19:30 · 水族馆",
      "location": "aquarium",
      "lines": [
        {
          "speaker": "旁白",
          "text": "水族馆里很安静。蓝色的光从水面上落下来，水母像一盏一盏慢慢呼吸的灯。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "smile",
          "text": "原来真的有这么大的水母。"
        },
        {
          "speaker": "旁白",
          "text": "她趴在玻璃前看了很久，鼻尖几乎要贴上去。"
        },
        {
          "speaker": "奶龙酱",
          "mood": "shy",
          "text": "谢谢你带我来。我念叨了好久，但一直没人陪。"
        },
        {
          "speaker": "你",
          "text": "以后我可以陪你。"
        },
        {
          "speaker": "旁白",
          "text": "她转过头看你，蓝色的光落在她眼睛里。"
        },
        {
          "speaker": "旁白",
          "text": "水母在玻璃后面缓慢地上下浮动，像一群不会说话的心事。"
        },
        {
          "speaker": "旁白",
          "text": "周围只剩水流的轻响。她把散落的头发别到耳后。"
        }
      ],
      "options": [
        {
          "text": "等周围安静下来，看着她的眼睛，慢慢把喜欢说清楚。",
          "delta": 8,
          "tag": "boundary",
          "mood": "shy",
          "finalTone": "respectful",
          "next": "",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "shy",
              "text": "……你让我缓一下。"
            },
            {
              "speaker": "旁白",
              "text": "过了一会儿，她的手指轻轻碰了碰你的手背。"
            }
          ],
          "note": "安静、清楚、只给她一个人听。"
        },
        {
          "text": "让工作人员推来一车气球，在游客面前大声表白。",
          "delta": -10,
          "tag": "boundary",
          "mood": "surprised",
          "flag": "overstep",
          "finalTone": "pushy",
          "next": "",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "surprised",
              "text": "……我们能不能先出去？"
            },
            {
              "speaker": "旁白",
              "text": "她低着头，声音几乎被背景音乐盖住。"
            }
          ],
          "note": "水族馆最珍贵的是安静。你把安静打碎了。"
        },
        {
          "text": "假装只是随口一提：「你觉得我们这样，算不算在一起？」",
          "delta": -5,
          "tag": "communication",
          "mood": "normal",
          "finalTone": "withdraw",
          "next": "",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "mood": "normal",
              "text": "……你是在问我，还是在问你自己？"
            },
            {
              "speaker": "旁白",
              "text": "她看着水母，没有再看你。"
            }
          ],
          "note": "绕弯子会把答案推远。喜欢需要一句清楚的话。"
        }
      ],
      "custom": {
        "placeholder": "蓝色的光里，你想怎么告诉她？",
        "rules": [
          {
            "option": 0,
            "keys": [
              "喜欢",
              "说清楚",
              "安静",
              "眼睛",
              "慢慢",
              "认真"
            ]
          },
          {
            "option": 1,
            "keys": [
              "气球",
              "工作人员",
              "大声",
              "游客",
              "当众",
              "表白"
            ]
          },
          {
            "option": 2,
            "keys": [
              "算不算",
              "随口",
              "在一起",
              "问问",
              "这样"
            ]
          }
        ],
        "fallback": 0
      }
    },
    "c1_library": {
      "chapter": "ch1",
      "step": 3,
      "background": "library",
      "narration": "周三 21:40 · 图书馆三楼",
      "lines": [
        {
          "speaker": "旁白",
          "text": "周三晚上，图书馆三楼。你在靠窗的位置坐下，摊开书，二十分钟没翻页。"
        },
        {
          "speaker": "旁白",
          "text": "对面的椅子被轻轻拉开。是她，抱着一摞书，看到你时愣了半秒。"
        },
        {
          "speaker": "奶龙酱",
          "text": "好巧。",
          "mood": "smile"
        },
        {
          "speaker": "你",
          "text": "好巧。"
        },
        {
          "speaker": "旁白",
          "text": "她把书放下，挑了你斜对面的位置——不近不远，抬头就能看见。"
        },
        {
          "speaker": "旁白",
          "text": "十点半，管理员开始关灯。她收拾得很慢，慢到整个自习区只剩你们两个。"
        },
        {
          "speaker": "奶龙酱",
          "text": "那个……上次的笔记，谢谢。",
          "mood": "shy"
        },
        {
          "speaker": "旁白",
          "text": "她说完就低头，把笔帽按了三次，咔哒、咔哒、咔哒。"
        },
        {
          "speaker": "奶龙酱",
          "text": "你的字很好看。",
          "mood": "normal"
        }
      ],
      "options": [
        {
          "text": "「抄得很急，本来想重写一遍再给你。」",
          "delta": 7,
          "tag": "detail",
          "next": "c1_walk",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "text": "不用重写。",
              "mood": "smile"
            },
            {
              "speaker": "旁白",
              "text": "她把笔记往怀里收了收，像收一件怕被抢走的东西。"
            }
          ],
          "mood": "smile",
          "note": "承认自己在意，比直接夸她更有分量。"
        },
        {
          "text": "「字好看没用，题会做才行。」",
          "delta": -5,
          "tag": "communication",
          "next": "c1_walk",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "text": "……嗯，也是。",
              "mood": "normal"
            },
            {
              "speaker": "旁白",
              "text": "她把书摞好，站起来，动作比刚才快了很多。"
            }
          ],
          "mood": "normal",
          "note": "她递出来的是话头，不是问题。"
        },
        {
          "text": "「以后我的笔记都给你抄。」",
          "delta": 4,
          "tag": "boundary",
          "next": "c1_walk",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "text": "那怎么行。",
              "mood": "surprised"
            },
            {
              "speaker": "旁白",
              "text": "她笑了一下，又补一句：我可以自己补的。"
            }
          ],
          "mood": "surprised",
          "note": "好意太满，会让她想着怎么还。"
        }
      ]
    },
    "c1_walk": {
      "chapter": "ch1",
      "step": 4,
      "background": "campus",
      "narration": "周三 22:15 · 图书馆到宿舍的路",
      "lines": [
        {
          "speaker": "旁白",
          "text": "出了图书馆，风把梧桐叶吹得沙沙响。"
        },
        {
          "speaker": "旁白",
          "text": "她走在你左边半步，抱着那摞书，书脊顶到下巴。"
        },
        {
          "speaker": "奶龙酱",
          "text": "你住几号楼？",
          "mood": "normal"
        },
        {
          "speaker": "你",
          "text": "六号。你呢？"
        },
        {
          "speaker": "奶龙酱",
          "text": "四号。正好顺路。",
          "mood": "smile"
        },
        {
          "speaker": "旁白",
          "text": "其实不顺路。四号楼在另一个方向，要多走三百米。"
        },
        {
          "speaker": "旁白",
          "text": "走到岔路口，她停下脚步。"
        },
        {
          "speaker": "奶龙酱",
          "text": "我……这边。",
          "mood": "shy"
        }
      ],
      "options": [
        {
          "text": "「那我送你到楼下，反正不远。」",
          "delta": 8,
          "tag": "action",
          "next": "c1_night",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "text": "不用不用，真的。",
              "mood": "shy"
            },
            {
              "speaker": "旁白",
              "text": "嘴上说着不用，脚步却放慢了半拍。"
            }
          ],
          "mood": "shy",
          "note": "她说不用的时候，往往在等你说「我坚持」。"
        },
        {
          "text": "「那你路上小心。」",
          "delta": 2,
          "tag": "timing",
          "next": "c1_night",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "text": "嗯。",
              "mood": "normal"
            },
            {
              "speaker": "旁白",
              "text": "她走了两步，回头挥了挥手。"
            }
          ],
          "mood": "normal",
          "note": "稳妥，但也只是稳妥。"
        },
        {
          "text": "「你不是说顺路吗？」",
          "delta": -6,
          "tag": "listening",
          "next": "c1_night",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "text": "……对哦。",
              "mood": "surprised"
            },
            {
              "speaker": "旁白",
              "text": "她抱着书转身就走，走得比刚才快。"
            }
          ],
          "mood": "surprised",
          "note": "把她的好意拆穿，等于把台阶拆了。"
        }
      ]
    },
    "c1_gomoku": {
      "chapter": "ch1",
      "step": 5,
      "background": "dorm-night-boy",
      "narration": "周三 23:40 · 男生宿舍",
      "lines": [
        {
          "speaker": "旁白",
          "text": "十一点四十，手机又亮了。"
        },
        {
          "speaker": "奶龙酱",
          "text": "你睡了吗"
        },
        {
          "speaker": "奶龙酱",
          "text": "睡不着"
        },
        {
          "speaker": "旁白",
          "text": "你正准备回，她又发来一条。"
        },
        {
          "speaker": "奶龙酱",
          "text": "听说你们宿舍都在下五子棋"
        },
        {
          "speaker": "奶龙酱",
          "text": "你会吗"
        }
      ],
      "options": [
        {
          "text": "「输的人请奶茶？」",
          "delta": 0,
          "tag": "action",
          "game": "gomoku",
          "invite": "「会一点。输的人请奶茶？」",
          "next": "c1_gomoku_end",
          "mood": "smile",
          "reaction": [],
          "note": "把胜负变成约定，比单纯陪她玩更近一步。"
        },
        {
          "text": "「会。不过今天太晚了，明天？」",
          "delta": 2,
          "tag": "timing",
          "next": "c1_gomoku_end",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "text": "好。",
              "mood": "normal"
            },
            {
              "speaker": "旁白",
              "text": "她回得很快，快得像是早就准备好了这句回答。"
            }
          ],
          "mood": "normal",
          "note": "照顾她的作息，也是一种在意。"
        },
        {
          "text": "「不会。」",
          "delta": -4,
          "tag": "listening",
          "next": "c1_gomoku_end",
          "reaction": [
            {
              "speaker": "奶龙酱",
              "text": "哦。",
              "mood": "normal"
            },
            {
              "speaker": "旁白",
              "text": "对话框上方显示「正在输入」，停了很久，最后什么也没发来。"
            }
          ],
          "mood": "normal",
          "note": "她其实是在找话，不是真的想下棋。"
        }
      ]
    },
    "c1_gomoku_end": {
      "chapter": "ch1",
      "step": 6,
      "background": "dorm-night-boy",
      "narration": "周三 00:20 · 男生宿舍",
      "lines": [
        {
          "speaker": "旁白",
          "text": "你放下手机，屏幕暗下去之前，最后一条是她的头像。"
        },
        {
          "speaker": "旁白",
          "text": "窗外月亮停在两栋楼之间，像一个还没写完的句号。"
        },
        {
          "speaker": "奶龙酱",
          "text": "晚安"
        }
      ],
      "next": "c2_radio",
      "options": []
    }
  },
  "endings": [
    {
      "id": "overstep",
      "priority": 0,
      "title": "越界的温柔",
      "subtitle": "你给的是关心，她感受到的是压力",
      "minScore": 0,
      "maxScore": 100,
      "requiresFlag": "overstep",
      "mood": "sad",
      "text": "你准备的惊喜，最后变成她需要应付的场面。回宿舍的路上，她走在你前面半步，像隔着一场还没停的雨。你终于明白，关心如果越过了她划下的线，就会从温暖变成负担。下一次，先问一句「你希望我怎么做」，比替她安排一切更重要。",
      "advice": "喜欢不是把对方拉进你的剧本，而是先问她愿不愿意上台。",
      "flavors": {
        "track": "操场上的蜡烛被风吹灭了几根。她站在人群中间，笑得很勉强。",
        "ferris": "摩天轮下的起哄声传得很远。她坐进轿厢后，一直没怎么说话。",
        "aquarium": "气球挡住了水母缸的光。她小声说想先回去。"
      }
    },
    {
      "id": "best",
      "priority": 1,
      "title": "双向奔赴",
      "subtitle": "你们把喜欢，说成了两个人的事",
      "minScore": 80,
      "maxScore": 100,
      "requiresMemory": 5,
      "tones": [
        "respectful",
        "repair"
      ],
      "mood": "smile",
      "text": "她看着你，过了很久才轻轻点头：「那……试试看吧。」你问她要不要再走一圈，她说好。晚风从你们中间穿过去，路灯把影子拉得很长，谁也没松开手。回去的路上，她忽然说：「明天早上，我帮你占座。」你笑着点头。原来喜欢被回应，是这么具体的一件事。",
      "advice": "你的倾听、细节和分寸感，是这段关系最好的开始。继续把对方当成一个具体的人，而不是一个需要攻略的目标。",
      "flavors": {
        "track": "操场的灯一盏一盏熄灭，她还站在原地。你问她要不要回去，她摇摇头，说想再走一圈。",
        "ferris": "摩天轮转到最高处时，整座城市的灯都在脚下。她没有看夜景，一直在看你。轿厢落回地面时，她小声说，其实刚才一直没敢往下看。",
        "aquarium": "水母缸的蓝光慢慢流转。她隔着玻璃看了很久，忽然说：「以后还可以再来吗？」"
      }
    },
    {
      "id": "almost",
      "priority": 2,
      "title": "差一点心动",
      "subtitle": "你很喜欢她，但还没真正听懂她",
      "minScore": 65,
      "maxScore": 100,
      "mood": "shy",
      "text": "她说你很好，只是还差一点。你问差在哪里，她想了想，说：「你好像很喜欢我，但还没有真的听懂我。」那天晚上，你把她说过的话重新想了一遍。喜欢一个人，光有热情和勇敢不够，还要记住她说过的话，听懂她没有说出口的部分。",
      "advice": "下次靠近一个人时，先别急着想下一句说什么。先听她把话说完。",
      "flavors": {
        "track": "她陪你走完最后一圈，说今晚的风很舒服。到了宿舍楼下，她只说了一句「晚安」。",
        "ferris": "摩天轮落地，她轻轻抽回手，说想再想想。你看见她的耳朵红了，但没敢问。",
        "aquarium": "水族馆的灯一盏盏暗下去。她说今天很开心，却没有回答你的那句话。"
      }
    },
    {
      "id": "slow",
      "priority": 3,
      "title": "慢慢靠近",
      "subtitle": "不是所有喜欢都要立刻有答案",
      "minScore": 45,
      "maxScore": 100,
      "mood": "shy",
      "text": "她没有立刻答应，也没有拒绝。她说想再相处看看，你说好。后来的日子里，你们继续一起上自习、听广播、在食堂交换彼此不吃的菜。关系没有立刻改变，但你们都比昨天更诚实了一点。有一次她递给你一杯奶茶，三分糖，芋泥。你忽然懂了，这就是她慢慢靠近的方式。",
      "advice": "不是所有喜欢都要立刻有答案。尊重节奏，本身就是一种爱人的能力。",
      "flavors": {
        "track": "你们在操场走了一圈又一圈，谁都没提刚才的话。分开时，她说明天图书馆见。",
        "ferris": "轿厢落地，她先走出去，又回头等你。你们并肩走回学校，像什么都没发生，又像什么都变了。",
        "aquarium": "她蹲在水母缸前看了很久，说你今天说的话，她记住了。"
      }
    },
    {
      "id": "miss",
      "priority": 4,
      "title": "遗憾错过",
      "subtitle": "有些喜欢，需要学会在失去前表达",
      "minScore": 0,
      "maxScore": 100,
      "fallback": true,
      "mood": "sad",
      "text": "她轻轻说了声抱歉。你笑着说没关系，转身走进夜色里。这段没有开始的关系，仍然教会了你一些事：喜欢一个人，不是把她变成你的答案，而是先学会看见她的感受。把这次的遗憾留在游戏里，现实中，慢一点，再认真一点。",
      "advice": "把这次的遗憾留在游戏里。现实中，先学会倾听和尊重，再去靠近一个人。",
      "flavors": {
        "track": "她说了抱歉。操场的风很大，你听得很清楚。",
        "ferris": "她低着头，说不想在高处做决定。舱门打开时，她先走了出去。",
        "aquarium": "她看着水里的鱼，说我们还是做朋友吧。蓝色的光落在她脸上，你看不清她的表情。"
      }
    }
  ]
};
