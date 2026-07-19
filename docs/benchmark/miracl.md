# BakaSearch — MIRACL 多语言检索

生成时间：2026-07-19 16:22:24 UTC

## 摘要

| 指标 | 数值 |
|------|------|
| 纯 BM25 nDCG@10 | **0.4806** |
| +桥扩展 nDCG@10 | **0.4533** |
| 差值 | **-0.0273** |
| 排行榜排名（纯 BM25） | **#47 / 102** |
| 排行榜排名（+桥扩展） | **#49 / 102** |
| 总文档数 | 2449382 |
| 总查询数 | 11076 |
| 索引吞吐 | 1540 doc/s |
| 纯 BM25 搜索延迟 | 85.92 ms/query |
| +桥扩展搜索延迟 | 151.68 ms/query |
| 总耗时 | 4903s (81.7 min) |

## 分语言对比

| 语种 | 纯 BM25 | +桥扩展 | 差值 | 搜索(ms/q) | 桥搜索(ms/q) |
|------|---------|--------|------|-----------|-------------|
| ar | 0.4320 | 0.4098 | -0.0222 | 158.27 | 193.88 |
| bn | 0.6890 | 0.6688 | -0.0202 | 106.91 | 248.68 |
| de | 0.3714 | 0.3390 | -0.0324 | 29.39 | 65.98 |
| en | 0.4790 | 0.4906 | +0.0115 | 88.26 | 225.57 |
| es | 0.2286 | 0.1931 | -0.0355 | 107.82 | 153.50 |
| fa | 0.3536 | 0.3417 | -0.0119 | 100.47 | 111.01 |
| fi | 0.6329 | 0.5946 | -0.0383 | 194.73 | 329.05 |
| fr | 0.3921 | 0.4014 | +0.0093 | 34.20 | 58.03 |
| hi | 0.5225 | 0.4831 | -0.0393 | 34.64 | 54.74 |
| id | 0.4411 | 0.4293 | -0.0118 | 61.13 | 219.27 |
| ja | 0.5871 | 0.5594 | -0.0277 | 125.61 | 159.23 |
| ko | 0.5250 | 0.4675 | -0.0574 | 21.44 | 34.07 |
| ru | 0.5687 | 0.5567 | -0.0120 | 139.74 | 367.11 |
| sw | 0.5029 | 0.4410 | -0.0619 | 83.98 | 143.42 |
| te | 0.1571 | 0.1060 | -0.0511 | 99.99 | 151.61 |
| th | 0.6424 | 0.5854 | -0.0570 | 136.22 | 157.20 |
| yo | 0.6033 | 0.5847 | -0.0186 | 16.09 | 24.74 |
| zh | 0.5226 | 0.5071 | -0.0155 | 7.68 | 33.07 |
| **平均** | **0.4806** | **0.4533** | **-0.0273** | 85.92 | 151.68 |

## 排行榜

| 排名 | 模型 | nDCG@10 |
|------|------|---------|
| #1 | Qwen/Qwen3-Embedding-8B | 0.7921 |
| #2 | BAAI/bge-m3 | 0.7890 |
| #3 | Qwen/Qwen3-Embedding-4B | 0.7855 |
| #4 | ICT-TIME-and-Querit/BOOM_4B_v1 | 0.7725 |
| #5 | Cohere/Cohere-embed-multilingual-v3.0 | 0.7679 |
| #6 | ICT-TIME-and-Querit/ICT-TIME-and-Querit-embedding-v1 | 0.7671 |
| #7 | bflhc/MoD-Embedding | 0.7567 |
| #8 | Cohere/Cohere-embed-v4.0 | 0.7505 |
| #9 | Cohere/Cohere-embed-v4.0_(output_dtype=int8) | 0.7497 |
| #10 | Alibaba-NLP/gte-Qwen2-1.5B-instruct | 0.7461 |
| #11 | BidirLM/BidirLM-1.7B-Embedding | 0.7455 |
| #12 | BidirLM/BidirLM-Omni-2.5B-Embedding | 0.7417 |
| #13 | BidirLM/BidirLM-1B-Embedding | 0.7375 |
| #14 | BidirLM/BidirLM-0.6B-Embedding | 0.7333 |
| #15 | Cohere/Cohere-embed-multilingual-light-v3.0 | 0.7272 |
| #16 | Octen/octen-vl-embedding-large | 0.7261 |
| #17 | Octen/Octen-Embedding-8B | 0.7183 |
| #18 | Alibaba-NLP/gte-multilingual-base | 0.7177 |
| #19 | Octen/Octen-Embedding-4B | 0.7134 |
| #20 | SamilPwC-AXNode-GenAI/PwC-Embedding_expr | 0.7112 |
| #21 | Cohere/Cohere-embed-v4.0_(output_dtype=binary) | 0.7065 |
| #22 | Qwen/Qwen3-Embedding-0.6B | 0.7050 |
| #23 | Octen/Octen-Embedding-8B-INT8 | 0.7043 |
| #24 | IEITYuan/Yuan-embedding-2.0-en | 0.7042 |
| #25 | Octen/Octen-Embedding-4B-INT8 | 0.6939 |
| #26 | Octen/Octen-Embedding-0.6B | 0.6934 |
| #27 | Salesforce/SFR-Embedding-Mistral | 0.6638 |
| #28 | BidirLM/BidirLM-270M-Embedding | 0.6467 |
| #29 | OrdalieTech/Solon-embeddings-large-0.1 | 0.6407 |
| #30 | Octen/octen-vl-embedding | 0.6386 |
| #31 | Bytedance/Seed1.6-embedding-1215 | 0.6324 |
| #32 | Lajavaness/bilingual-embedding-base | 0.6298 |
| #33 | Omartificial-Intelligence-Space/Arabic-Triplet-Matryoshka-V2_external | 0.6262 |
| #34 | HIT-TMG/KaLM-embedding-multilingual-mini-v1 | 0.6260 |
| #35 | Linq-AI-Research/Linq-Embed-Mistral | 0.6084 |
| #36 | Lajavaness/bilingual-embedding-large | 0.6040 |
| #37 | codefuse-ai/F2LLM-0.6B | 0.5995 |
| #38 | Alibaba-NLP/gte-Qwen2-7B-instruct | 0.5895 |
| #39 | GritLM/GritLM-7B | 0.5845 |
| #40 | Lajavaness/bilingual-embedding-small | 0.5540 |
| #41 | Salesforce/SFR-Embedding-2_R | 0.5424 |
| #42 | BAAI/bge-m3-unsupervised | 0.5323 |
| #43 | PartAI/Tooka-SBERT-V2-Small | 0.5306 |
| #44 | MCINext/Hakim-unsup | 0.5143 |
| #45 | GritLM/GritLM-8x7B | 0.5053 |
| #46 | PartAI/Tooka-SBERT-V2-Large | 0.4854 |
| #47 | BakaSearch（纯 BM25） | 0.4806 ← |
| #48 | MCINext/Hakim | 0.4725 |
| #49 | Alibaba-NLP/gte-Qwen1.5-7B-instruct | 0.4647 |
| #50 | BakaSearch（+桥扩展） | 0.4533 ← |
| #51 | MCINext/Hakim-small | 0.4488 |
| #52 | HIT-TMG/KaLM-embedding-multilingual-mini-instruct-v1 | 0.3144 |
| #53 | Omartificial-Intelligence-Space/Arabic-all-nli-triplet-Matryoshka | 0.3015 |
| #54 | PartAI/Tooka-SBERT | 0.2643 |
| #55 | Omartificial-Intelligence-Space/Arabert-all-nli-triplet-Matryoshka | 0.2258 |
| #56 | Omartificial-Intelligence-Space/Arabic-labse-Matryoshka | 0.1884 |
| #57 | bigscience/sgpt-bloom-7b1-msmarco | 0.1838 |
| #58 | NovaSearch/jasper_en_vision_language_v1 | 0.1767 |
| #59 | Omartificial-Intelligence-Space/Marbert-all-nli-triplet-Matryoshka | 0.1585 |
| #60 | Cohere/Cohere-embed-english-v3.0 | 0.1406 |
| #61 | NovaSearch/stella_en_1.5B_v5 | 0.1386 |
| #62 | BAAI/bge-large-en | 0.1213 |
| #63 | HooshvareLab/bert-base-parsbert-uncased | 0.0775 |
| #64 | WhereIsAI/UAE-Large-V1 | 0.0744 |
| #65 | BAAI/bge-large-en-v1.5 | 0.0715 |
| #66 | Omartificial-Intelligence-Space/Arabic-mpnet-base-all-nli-triplet | 0.0620 |
| #67 | PartAI/TookaBERT-Base | 0.0521 |
| #68 | avsolatorio/GIST-large-Embedding-v0 | 0.0469 |
| #69 | BAAI/bge-base-en | 0.0294 |
| #70 | Alibaba-NLP/gte-base-en-v1.5 | 0.0292 |
| #71 | BAAI/bge-base-en-v1.5 | 0.0249 |
| #72 | Jaume/gemma-2b-embeddings | 0.0146 |
| #73 | avsolatorio/GIST-Embedding-v0 | 0.0123 |
| #74 | avsolatorio/NoInstruct-small-Embedding-v0 | 0.0061 |
| #75 | Cohere/Cohere-embed-english-light-v3.0 | 0.0059 |
| #76 | BAAI/bge-small-en-v1.5 | 0.0045 |
| #77 | NovaSearch/stella_en_400M_v5 | 0.0040 |
| #78 | avsolatorio/GIST-small-Embedding-v0 | 0.0034 |
| #79 | Snowflake/snowflake-arctic-embed-l | 0.0026 |
| #80 | Mihaiii/Ivysaur | 0.0020 |
| #81 | abhinand/MedEmbed-small-v0.1 | 0.0019 |
| #82 | Mihaiii/Squirtle | 0.0019 |
| #83 | Snowflake/snowflake-arctic-embed-m-v1.5 | 0.0018 |
| #84 | Snowflake/snowflake-arctic-embed-m-long | 0.0013 |
| #85 | Mihaiii/Venusaur | 0.0013 |
| #86 | Snowflake/snowflake-arctic-embed-m | 0.0010 |
| #87 | Mihaiii/gte-micro-v4 | 0.0008 |
| #88 | Mihaiii/Bulbasaur | 0.0007 |
| #89 | brahmairesearch/slx-v0.1 | 0.0005 |
| #90 | Snowflake/snowflake-arctic-embed-xs | 0.0005 |
| #91 | Mihaiii/Wartortle | 0.0005 |
| #92 | Mihaiii/gte-micro | 0.0003 |
| #93 | aari1995/German_Semantic_STS_V2 | 0.0000 |
| #94 | ai-forever/ru-en-RoSBERTa | 0.0000 |
| #95 | ai-forever/sbert_large_mt_nlu_ru | 0.0000 |
| #96 | ai-forever/sbert_large_nlu_ru | 0.0000 |
| #97 | BAAI/bge-base-zh-v1.5 | 0.0000 |
| #98 | BAAI/bge-large-zh-v1.5 | 0.0000 |
| #99 | BAAI/bge-small-zh-v1.5 | 0.0000 |
| #100 | DeepPavlov/distilrubert-small-cased-conversational | 0.0000 |
| #101 | DeepPavlov/rubert-base-cased-sentence | 0.0000 |
| #102 | DeepPavlov/rubert-base-cased | 0.0000 |
| #103 | Snowflake/snowflake-arctic-embed-s | 0.0000 |

