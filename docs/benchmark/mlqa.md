# BakaSearch — MLQA 跨语言检索

生成时间：2026-07-19 16:46:16 UTC

## 摘要

| 指标 | 数值 |
|------|------|
| 纯 BM25 nDCG@10 | **0.1664** |
| +桥扩展 nDCG@10 | **0.1876** |
| 差值 | **+0.0212** |
| 排行榜排名（纯 BM25） | **#42 / 77** |
| 排行榜排名（+桥扩展） | **#41 / 77** |
| 总文档数 | 138636 |
| 总查询数 | 158029 |
| 索引吞吐 | 733 doc/s |
| 纯 BM25 搜索延迟 | 0.59 ms/query |
| +桥扩展搜索延迟 | 1.52 ms/query |
| 总耗时 | 817s (13.6 min) |

## 分语言对比

| 语种 | 纯 BM25 | +桥扩展 | 差值 | 搜索(ms/q) | 桥搜索(ms/q) |
|------|---------|--------|------|-----------|-------------|
| ara-ara | 0.2991 | 0.2733 | -0.0258 | 2.75 | 3.07 |
| ara-deu | 0.0020 | 0.0036 | +0.0016 | 0.26 | 0.83 |
| ara-eng | 0.0454 | 0.0420 | -0.0034 | 0.35 | 2.50 |
| ara-hin | 0.0146 | 0.0344 | +0.0199 | 0.16 | 0.69 |
| ara-spa | 0.0572 | 0.0678 | +0.0106 | 0.20 | 0.83 |
| ara-vie | 0.0538 | 0.0594 | +0.0056 | 0.28 | 0.94 |
| ara-zho | 0.0246 | 0.0744 | +0.0498 | 0.07 | 0.35 |
| deu-ara | 0.0310 | 0.0547 | +0.0237 | 0.21 | 0.42 |
| deu-deu | 0.5063 | 0.4913 | -0.0150 | 1.52 | 2.61 |
| deu-eng | 0.2428 | 0.2428 | +0.0000 | 0.62 | 2.15 |
| deu-hin | 0.0256 | 0.0743 | +0.0487 | 0.18 | 0.58 |
| deu-spa | 0.2868 | 0.3156 | +0.0287 | 0.30 | 0.75 |
| deu-vie | 0.2945 | 0.2904 | -0.0041 | 0.35 | 0.72 |
| deu-zho | 0.0681 | 0.1634 | +0.0954 | 0.08 | 0.20 |
| eng-ara | 0.0249 | 0.0389 | +0.0139 | 0.31 | 1.27 |
| eng-deu | 0.3320 | 0.3559 | +0.0239 | 0.73 | 2.20 |
| eng-eng | 0.5809 | 0.5317 | -0.0493 | 3.36 | 6.78 |
| eng-hin | 0.0248 | 0.0916 | +0.0668 | 0.31 | 1.76 |
| eng-spa | 0.2829 | 0.3471 | +0.0642 | 0.61 | 2.24 |
| eng-vie | 0.2950 | 0.2796 | -0.0154 | 0.73 | 2.70 |
| eng-zho | 0.0620 | 0.2086 | +0.1466 | 0.21 | 0.67 |
| hin-ara | 0.0182 | 0.0453 | +0.0270 | 0.14 | 0.46 |
| hin-deu | 0.0604 | 0.0996 | +0.0393 | 0.20 | 0.54 |
| hin-eng | 0.0502 | 0.0694 | +0.0192 | 0.28 | 1.97 |
| hin-hin | 0.4101 | 0.3869 | -0.0232 | 1.56 | 2.36 |
| hin-spa | 0.0542 | 0.0907 | +0.0365 | 0.17 | 0.69 |
| hin-vie | 0.0507 | 0.0621 | +0.0114 | 0.33 | 0.87 |
| hin-zho | 0.0360 | 0.1823 | +0.1464 | 0.06 | 0.34 |
| spa-ara | 0.0218 | 0.0512 | +0.0294 | 0.22 | 0.48 |
| spa-deu | 0.2785 | 0.2887 | +0.0102 | 0.37 | 0.98 |
| spa-eng | 0.2143 | 0.2443 | +0.0301 | 0.69 | 3.26 |
| spa-hin | 0.0256 | 0.0855 | +0.0599 | 0.24 | 0.87 |
| spa-spa | 0.4880 | 0.4830 | -0.0050 | 2.47 | 3.76 |
| spa-vie | 0.2628 | 0.2526 | -0.0102 | 0.48 | 1.22 |
| spa-zho | 0.0653 | 0.2068 | +0.1415 | 0.11 | 0.29 |
| vie-ara | 0.0169 | 0.0242 | +0.0073 | 0.21 | 0.72 |
| vie-deu | 0.3326 | 0.2977 | -0.0349 | 0.35 | 0.98 |
| vie-eng | 0.2021 | 0.1665 | -0.0356 | 0.57 | 3.37 |
| vie-hin | 0.0216 | 0.0460 | +0.0243 | 0.26 | 1.13 |
| vie-spa | 0.2767 | 0.2433 | -0.0334 | 0.33 | 1.16 |
| vie-vie | 0.5167 | 0.4582 | -0.0585 | 2.68 | 4.78 |
| vie-zho | 0.0598 | 0.1156 | +0.0558 | 0.14 | 0.79 |
| zho-ara | 0.0259 | 0.0396 | +0.0137 | 0.34 | 0.96 |
| zho-deu | 0.1340 | 0.1371 | +0.0031 | 0.38 | 0.82 |
| zho-eng | 0.0944 | 0.1103 | +0.0159 | 0.53 | 2.23 |
| zho-hin | 0.0247 | 0.0674 | +0.0427 | 0.23 | 0.67 |
| zho-spa | 0.1092 | 0.1462 | +0.0369 | 0.24 | 0.55 |
| zho-vie | 0.1173 | 0.1374 | +0.0201 | 0.36 | 0.87 |
| zho-zho | 0.6324 | 0.6145 | -0.0179 | 1.16 | 2.89 |
| **平均** | **0.1664** | **0.1876** | **+0.0212** | 0.59 | 1.52 |

## 排行榜

| 排名 | 模型 | nDCG@10 |
|------|------|---------|
| #1 | Mira190/Euler-Legal-Embedding-V1 | 0.7289 |
| #2 | Qwen/Qwen3-Embedding-8B | 0.7249 |
| #3 | Octen/Octen-Embedding-8B | 0.7199 |
| #4 | Qwen/Qwen3-Embedding-4B | 0.6972 |
| #5 | Bytedance/Seed1.6-embedding-1215 | 0.6826 |
| #6 | ICT-TIME-and-Querit/BOOM_4B_v1 | 0.6710 |
| #7 | ICT-TIME-and-Querit/ICT-TIME-and-Querit-embedding-v1 | 0.6703 |
| #8 | Alibaba-NLP/gte-Qwen2-7B-instruct | 0.6568 |
| #9 | Cohere/Cohere-embed-multilingual-v3.0 | 0.6409 |
| #10 | BAAI/bge-m3 | 0.6285 |
| #11 | BidirLM/BidirLM-Omni-2.5B-Embedding | 0.6256 |
| #12 | OrdalieTech/Solon-embeddings-large-0.1 | 0.6165 |
| #13 | BidirLM/BidirLM-1.7B-Embedding | 0.6116 |
| #14 | HIT-TMG/KaLM-embedding-multilingual-mini-v1 | 0.6104 |
| #15 | Alibaba-NLP/gte-Qwen2-1.5B-instruct | 0.6069 |
| #16 | Lajavaness/bilingual-embedding-large | 0.6057 |
| #17 | GritLM/GritLM-7B | 0.6039 |
| #18 | BidirLM/BidirLM-1B-Embedding | 0.5930 |
| #19 | Cohere/Cohere-embed-multilingual-light-v3.0 | 0.5854 |
| #20 | Lajavaness/bilingual-embedding-base | 0.5831 |
| #21 | Qwen/Qwen3-Embedding-0.6B | 0.5831 |
| #22 | Alibaba-NLP/gte-multilingual-base | 0.5698 |
| #23 | Salesforce/SFR-Embedding-Mistral | 0.5685 |
| #24 | BidirLM/BidirLM-0.6B-Embedding | 0.5560 |
| #25 | Lajavaness/bilingual-embedding-small | 0.5546 |
| #26 | Linq-AI-Research/Linq-Embed-Mistral | 0.5528 |
| #27 | Salesforce/SFR-Embedding-2_R | 0.5520 |
| #28 | GritLM/GritLM-8x7B | 0.5510 |
| #29 | Alibaba-NLP/gte-Qwen1.5-7B-instruct | 0.5121 |
| #30 | Omartificial-Intelligence-Space/Arabic-Triplet-Matryoshka-V2_external | 0.5093 |
| #31 | BidirLM/BidirLM-270M-Embedding | 0.4880 |
| #32 | Omartificial-Intelligence-Space/Arabert-all-nli-triplet-Matryoshka | 0.4508 |
| #33 | Omartificial-Intelligence-Space/Arabic-all-nli-triplet-Matryoshka | 0.4278 |
| #34 | Omartificial-Intelligence-Space/Arabic-labse-Matryoshka | 0.4103 |
| #35 | HIT-TMG/KaLM-embedding-multilingual-mini-instruct-v1 | 0.4080 |
| #36 | NovaSearch/jasper_en_vision_language_v1 | 0.3969 |
| #37 | Omartificial-Intelligence-Space/Marbert-all-nli-triplet-Matryoshka | 0.3713 |
| #38 | NovaSearch/stella_en_1.5B_v5 | 0.3411 |
| #39 | Haon-Chen/speed-embedding-7b-instruct | 0.2744 |
| #40 | Omartificial-Intelligence-Space/Arabic-mpnet-base-all-nli-triplet | 0.2051 |
| #41 | BakaSearch（+桥扩展） | 0.1876 ← |
| #42 | VPLabs/SearchMap_Preview | 0.1712 |
| #43 | BakaSearch（纯 BM25） | 0.1664 ← |
| #44 | bigscience/sgpt-bloom-7b1-msmarco | 0.1430 |
| #45 | Cohere/Cohere-embed-english-v3.0 | 0.0880 |
| #46 | Jaume/gemma-2b-embeddings | 0.0596 |
| #47 | avsolatorio/GIST-large-Embedding-v0 | 0.0535 |
| #48 | NovaSearch/stella_en_400M_v5 | 0.0491 |
| #49 | BAAI/bge-large-en-v1.5 | 0.0482 |
| #50 | WhereIsAI/UAE-Large-V1 | 0.0454 |
| #51 | avsolatorio/GIST-Embedding-v0 | 0.0373 |
| #52 | BAAI/bge-base-en-v1.5 | 0.0345 |
| #53 | Cohere/Cohere-embed-english-light-v3.0 | 0.0312 |
| #54 | Snowflake/snowflake-arctic-embed-m-long | 0.0269 |
| #55 | avsolatorio/NoInstruct-small-Embedding-v0 | 0.0257 |
| #56 | Snowflake/snowflake-arctic-embed-m-v1.5 | 0.0257 |
| #57 | Snowflake/snowflake-arctic-embed-l | 0.0232 |
| #58 | Mihaiii/Ivysaur | 0.0230 |
| #59 | avsolatorio/GIST-small-Embedding-v0 | 0.0224 |
| #60 | BAAI/bge-small-en-v1.5 | 0.0223 |
| #61 | Snowflake/snowflake-arctic-embed-m | 0.0211 |
| #62 | abhinand/MedEmbed-small-v0.1 | 0.0203 |
| #63 | Snowflake/snowflake-arctic-embed-s | 0.0186 |
| #64 | aari1995/German_Semantic_STS_V2 | 0.0148 |
| #65 | Snowflake/snowflake-arctic-embed-xs | 0.0130 |
| #66 | Mihaiii/Squirtle | 0.0127 |
| #67 | Mihaiii/Wartortle | 0.0119 |
| #68 | Mihaiii/Venusaur | 0.0096 |
| #69 | ai-forever/ru-en-RoSBERTa | 0.0092 |
| #70 | Mihaiii/Bulbasaur | 0.0091 |
| #71 | brahmairesearch/slx-v0.1 | 0.0064 |
| #72 | DeepPavlov/rubert-base-cased-sentence | 0.0057 |
| #73 | Mihaiii/gte-micro-v4 | 0.0053 |
| #74 | Mihaiii/gte-micro | 0.0050 |
| #75 | ai-forever/sbert_large_mt_nlu_ru | 0.0031 |
| #76 | DeepPavlov/distilrubert-small-cased-conversational | 0.0022 |
| #77 | DeepPavlov/rubert-base-cased | 0.0014 |
| #78 | ai-forever/sbert_large_nlu_ru | 0.0014 |

