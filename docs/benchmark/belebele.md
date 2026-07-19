# BakaSearch — Belebele 阅读理解检索

生成时间：2026-07-19 14:02:51 UTC

## 摘要

| 指标 | 数值 |
|------|------|
| 纯 BM25 nDCG@10 | **0.4811** |
| +桥扩展 nDCG@10 | **0.4740** |
| 差值 | **-0.0071** |
| 排行榜排名（纯 BM25） | **#51 / 89** |
| 排行榜排名（+桥扩展） | **#51 / 89** |
| 总文档数 | 109800 |
| 总查询数 | 109800 |
| 索引吞吐 | 1856 doc/s |
| 纯 BM25 搜索延迟 | 0.65 ms/query |
| +桥扩展搜索延迟 | 0.71 ms/query |
| 总耗时 | 418s (7.0 min) |

## 分语言对比

| 语种 | 纯 BM25 | +桥扩展 | 差值 | 搜索(ms/q) | 桥搜索(ms/q) |
|------|---------|--------|------|-----------|-------------|
| acm_Arab | 0.5015 | 0.4983 | -0.0032 | 0.44 | 0.48 |
| afr_Latn | 0.6334 | 0.6298 | -0.0035 | 0.51 | 0.57 |
| als_Latn | 0.5597 | 0.5496 | -0.0101 | 0.63 | 0.71 |
| amh_Ethi | 0.2650 | 0.2624 | -0.0026 | 0.80 | 0.85 |
| apc_Arab | 0.5470 | 0.5419 | -0.0052 | 0.44 | 0.50 |
| arb_Arab | 0.5375 | 0.5368 | -0.0007 | 0.49 | 0.53 |
| arb_Latn | 0.1371 | 0.1366 | -0.0005 | 0.63 | 0.72 |
| ars_Arab | 0.4499 | 0.4427 | -0.0072 | 0.42 | 0.46 |
| ary_Arab | 0.4463 | 0.4391 | -0.0072 | 0.55 | 0.58 |
| arz_Arab | 0.4658 | 0.4592 | -0.0066 | 0.48 | 0.49 |
| asm_Beng | 0.4209 | 0.4193 | -0.0016 | 0.71 | 0.73 |
| azj_Latn | 0.5458 | 0.5365 | -0.0094 | 0.63 | 0.73 |
| bam_Latn | 0.4412 | 0.4270 | -0.0142 | 0.80 | 0.93 |
| ben_Beng | 0.6103 | 0.6089 | -0.0014 | 0.33 | 0.39 |
| ben_Latn | 0.5468 | 0.5367 | -0.0102 | 0.57 | 0.65 |
| bod_Tibt | 0.0701 | 0.0702 | +0.0001 | 1.31 | 1.34 |
| bul_Cyrl | 0.6106 | 0.5996 | -0.0110 | 0.58 | 0.64 |
| cat_Latn | 0.6666 | 0.6610 | -0.0055 | 0.52 | 0.59 |
| ceb_Latn | 0.5191 | 0.5175 | -0.0016 | 0.58 | 0.67 |
| ces_Latn | 0.5951 | 0.5829 | -0.0122 | 0.43 | 0.50 |
| ckb_Arab | 0.3132 | 0.3046 | -0.0086 | 1.07 | 1.14 |
| dan_Latn | 0.6104 | 0.6040 | -0.0065 | 0.46 | 0.53 |
| deu_Latn | 0.6818 | 0.6735 | -0.0083 | 0.37 | 0.42 |
| ell_Grek | 0.4925 | 0.4869 | -0.0056 | 0.87 | 0.88 |
| eng_Latn | 0.6885 | 0.6688 | -0.0197 | 0.42 | 0.48 |
| est_Latn | 0.5401 | 0.5298 | -0.0103 | 0.44 | 0.50 |
| eus_Latn | 0.6079 | 0.5980 | -0.0099 | 0.54 | 0.64 |
| fin_Latn | 0.6291 | 0.6251 | -0.0040 | 0.43 | 0.50 |
| fra_Latn | 0.6623 | 0.6482 | -0.0141 | 0.55 | 0.60 |
| fuv_Latn | 0.1519 | 0.1510 | -0.0010 | 0.48 | 0.56 |
| gaz_Latn | 0.3751 | 0.3631 | -0.0120 | 0.77 | 0.85 |
| grn_Latn | 0.5159 | 0.5061 | -0.0098 | 0.74 | 0.86 |
| guj_Gujr | 0.3504 | 0.3477 | -0.0026 | 0.66 | 0.68 |
| hat_Latn | 0.4969 | 0.4802 | -0.0167 | 0.60 | 0.70 |
| hau_Latn | 0.3922 | 0.3815 | -0.0108 | 0.71 | 0.80 |
| heb_Hebr | 0.3348 | 0.3350 | +0.0002 | 0.72 | 0.76 |
| hin_Deva | 0.5339 | 0.5194 | -0.0145 | 0.45 | 0.50 |
| hin_Latn | 0.5333 | 0.5182 | -0.0151 | 0.52 | 0.62 |
| hrv_Latn | 0.6358 | 0.6306 | -0.0052 | 0.46 | 0.50 |
| hun_Latn | 0.6353 | 0.6178 | -0.0175 | 0.49 | 0.57 |
| hye_Armn | 0.1233 | 0.1241 | +0.0008 | 1.41 | 1.43 |
| ibo_Latn | 0.2734 | 0.2653 | -0.0082 | 0.89 | 0.94 |
| ilo_Latn | 0.5397 | 0.5254 | -0.0143 | 0.71 | 0.80 |
| ind_Latn | 0.6715 | 0.6635 | -0.0080 | 0.38 | 0.44 |
| isl_Latn | 0.5450 | 0.5367 | -0.0083 | 0.70 | 0.80 |
| ita_Latn | 0.6861 | 0.6759 | -0.0103 | 0.47 | 0.52 |
| jav_Latn | 0.6139 | 0.6131 | -0.0008 | 0.51 | 0.60 |
| jpn_Jpan | 0.7064 | 0.7074 | +0.0010 | 0.32 | 0.35 |
| kac_Latn | 0.3843 | 0.3801 | -0.0043 | 0.94 | 1.06 |
| kan_Knda | 0.4383 | 0.4397 | +0.0013 | 0.67 | 0.71 |
| kat_Geor | 0.2390 | 0.2340 | -0.0051 | 0.93 | 1.00 |
| kaz_Cyrl | 0.4684 | 0.4610 | -0.0074 | 0.80 | 0.88 |
| kea_Latn | 0.5102 | 0.4954 | -0.0148 | 0.56 | 0.63 |
| khk_Cyrl | 0.3630 | 0.3422 | -0.0209 | 1.04 | 1.15 |
| khm_Khmr | 0.3762 | 0.3737 | -0.0025 | 0.87 | 0.85 |
| kin_Latn | 0.4649 | 0.4535 | -0.0114 | 0.70 | 0.78 |
| kir_Cyrl | 0.5031 | 0.4965 | -0.0066 | 0.69 | 0.78 |
| kor_Hang | 0.6307 | 0.6301 | -0.0006 | 0.36 | 0.40 |
| lao_Laoo | 0.2606 | 0.2591 | -0.0014 | 1.04 | 1.06 |
| lin_Latn | 0.3468 | 0.3412 | -0.0056 | 0.62 | 0.73 |
| lit_Latn | 0.6457 | 0.6367 | -0.0090 | 0.52 | 0.59 |
| lug_Latn | 0.2830 | 0.2736 | -0.0094 | 0.69 | 0.78 |
| luo_Latn | 0.3843 | 0.3687 | -0.0157 | 0.63 | 0.71 |
| lvs_Latn | 0.6096 | 0.6003 | -0.0093 | 0.58 | 0.67 |
| mal_Mlym | 0.4972 | 0.4958 | -0.0015 | 0.57 | 0.60 |
| mar_Deva | 0.5598 | 0.5538 | -0.0060 | 0.39 | 0.46 |
| mkd_Cyrl | 0.5526 | 0.5353 | -0.0173 | 0.69 | 0.78 |
| mlt_Latn | 0.5618 | 0.5494 | -0.0124 | 0.77 | 0.84 |
| mri_Latn | 0.3068 | 0.2975 | -0.0093 | 0.88 | 0.94 |
| mya_Mymr | 0.2723 | 0.2722 | -0.0001 | 1.16 | 1.16 |
| nld_Latn | 0.6669 | 0.6606 | -0.0063 | 0.46 | 0.50 |
| nob_Latn | 0.6062 | 0.5963 | -0.0099 | 0.49 | 0.55 |
| npi_Deva | 0.4975 | 0.4894 | -0.0081 | 0.50 | 0.56 |
| npi_Latn | 0.4113 | 0.4032 | -0.0080 | 0.50 | 0.58 |
| nso_Latn | 0.3911 | 0.3908 | -0.0003 | 0.85 | 0.93 |
| nya_Latn | 0.3297 | 0.3229 | -0.0068 | 0.75 | 0.84 |
| ory_Orya | 0.0502 | 0.0500 | -0.0002 | 1.51 | 1.57 |
| pan_Guru | 0.1162 | 0.1147 | -0.0014 | 1.35 | 1.47 |
| pbt_Arab | 0.3727 | 0.3618 | -0.0109 | 0.73 | 0.80 |
| pes_Arab | 0.6203 | 0.6122 | -0.0080 | 0.46 | 0.51 |
| plt_Latn | 0.4909 | 0.4782 | -0.0127 | 0.86 | 0.94 |
| pol_Latn | 0.6149 | 0.6062 | -0.0087 | 0.43 | 0.48 |
| por_Latn | 0.6589 | 0.6525 | -0.0064 | 0.44 | 0.50 |
| ron_Latn | 0.6500 | 0.6444 | -0.0056 | 0.51 | 0.57 |
| rus_Cyrl | 0.6636 | 0.6574 | -0.0062 | 0.40 | 0.47 |
| shn_Mymr | 0.2511 | 0.2495 | -0.0017 | 1.26 | 1.26 |
| sin_Latn | 0.3317 | 0.3240 | -0.0077 | 0.74 | 0.85 |
| sin_Sinh | 0.3411 | 0.3390 | -0.0021 | 1.02 | 1.02 |
| slk_Latn | 0.6178 | 0.6088 | -0.0090 | 0.49 | 0.57 |
| slv_Latn | 0.5750 | 0.5636 | -0.0113 | 0.49 | 0.57 |
| sna_Latn | 0.4673 | 0.4543 | -0.0130 | 0.60 | 0.73 |
| snd_Arab | 0.3386 | 0.3382 | -0.0004 | 0.89 | 0.99 |
| som_Latn | 0.3359 | 0.3333 | -0.0026 | 0.76 | 0.86 |
| sot_Latn | 0.4070 | 0.3954 | -0.0116 | 0.75 | 0.85 |
| spa_Latn | 0.5444 | 0.5400 | -0.0044 | 0.47 | 0.53 |
| srp_Cyrl | 0.5767 | 0.5719 | -0.0048 | 0.63 | 0.73 |
| ssw_Latn | 0.3494 | 0.3385 | -0.0109 | 0.67 | 0.75 |
| sun_Latn | 0.4882 | 0.4838 | -0.0045 | 0.51 | 0.61 |
| swe_Latn | 0.6796 | 0.6723 | -0.0074 | 0.42 | 0.50 |
| swh_Latn | 0.5902 | 0.5830 | -0.0073 | 0.57 | 0.65 |
| tam_Taml | 0.5980 | 0.5963 | -0.0017 | 0.41 | 0.45 |
| tel_Telu | 0.4430 | 0.4403 | -0.0027 | 0.58 | 0.60 |
| tgk_Cyrl | 0.4674 | 0.4519 | -0.0156 | 0.96 | 1.07 |
| tgl_Latn | 0.6074 | 0.5975 | -0.0098 | 0.62 | 0.71 |
| tha_Thai | 0.6382 | 0.6375 | -0.0007 | 0.44 | 0.45 |
| tir_Ethi | 0.1523 | 0.1510 | -0.0014 | 1.26 | 1.32 |
| tsn_Latn | 0.4494 | 0.4337 | -0.0157 | 0.75 | 0.86 |
| tso_Latn | 0.5329 | 0.5232 | -0.0097 | 0.88 | 0.97 |
| tur_Latn | 0.6298 | 0.6225 | -0.0073 | 0.32 | 0.39 |
| ukr_Cyrl | 0.6006 | 0.5955 | -0.0051 | 0.53 | 0.61 |
| urd_Arab | 0.5252 | 0.5258 | +0.0005 | 0.52 | 0.56 |
| urd_Latn | 0.2271 | 0.2207 | -0.0064 | 0.62 | 0.70 |
| uzn_Latn | 0.5884 | 0.5717 | -0.0167 | 0.62 | 0.71 |
| vie_Latn | 0.7092 | 0.7111 | +0.0019 | 0.39 | 0.44 |
| war_Latn | 0.6394 | 0.6255 | -0.0139 | 0.65 | 0.73 |
| wol_Latn | 0.2896 | 0.2804 | -0.0092 | 0.63 | 0.74 |
| xho_Latn | 0.3826 | 0.3666 | -0.0161 | 0.66 | 0.76 |
| yor_Latn | 0.1723 | 0.1697 | -0.0026 | 0.73 | 0.84 |
| zho_Hans | 0.7209 | 0.7202 | -0.0007 | 0.23 | 0.26 |
| zho_Hant | 0.7015 | 0.7021 | +0.0006 | 0.24 | 0.28 |
| zsm_Latn | 0.6526 | 0.6519 | -0.0008 | 0.36 | 0.41 |
| zul_Latn | 0.3583 | 0.3500 | -0.0084 | 0.66 | 0.75 |
| **平均** | **0.4811** | **0.4740** | **-0.0071** | 0.65 | 0.71 |

## 排行榜

| 排名 | 模型 | nDCG@10 |
|------|------|---------|
| #1 | Mira190/Euler-Legal-Embedding-V1 | 0.9692 |
| #2 | Qwen/Qwen3-Embedding-8B | 0.9662 |
| #3 | Octen/Octen-Embedding-8B | 0.9646 |
| #4 | Qwen/Qwen3-VL-Embedding-8B | 0.9607 |
| #5 | LingoIITGN/qwen-indic-v1 | 0.9516 |
| #6 | BAAI/bge-multilingual-gemma2 | 0.9500 |
| #7 | Octen/Octen-Embedding-4B | 0.9462 |
| #8 | Qwen/Qwen3-VL-Embedding-2B | 0.9443 |
| #9 | clips/e5-base-trm-nl | 0.9380 |
| #10 | clips/e5-large-trm-nl | 0.9305 |
| #11 | clips/e5-small-trm-nl | 0.9244 |
| #12 | Qwen/Qwen3-Embedding-4B | 0.9219 |
| #13 | Alibaba-NLP/gte-Qwen2-7B-instruct | 0.9203 |
| #14 | ICT-TIME-and-Querit/ICT-TIME-and-Querit-embedding-v1 | 0.9058 |
| #15 | ICT-TIME-and-Querit/BOOM_4B_v1 | 0.9031 |
| #16 | BidirLM/BidirLM-Omni-2.5B-Embedding | 0.9030 |
| #17 | SamilPwC-AXNode-GenAI/PwC-Embedding_expr | 0.8967 |
| #18 | Cohere/Cohere-embed-multilingual-v3.0 | 0.8927 |
| #19 | Alibaba-NLP/gte-multilingual-base | 0.8920 |
| #20 | Bytedance/Seed1.6-embedding-1215 | 0.8912 |
| #21 | Octen/Octen-Embedding-0.6B | 0.8911 |
| #22 | BidirLM/BidirLM-1.7B-Embedding | 0.8849 |
| #23 | Lajavaness/bilingual-embedding-large | 0.8845 |
| #24 | BidirLM/BidirLM-1B-Embedding | 0.8779 |
| #25 | BAAI/bge-m3 | 0.8778 |
| #26 | Alibaba-NLP/gte-Qwen2-1.5B-instruct | 0.8739 |
| #27 | OrdalieTech/Solon-embeddings-large-0.1 | 0.8737 |
| #28 | GritLM/GritLM-7B | 0.8530 |
| #29 | IEITYuan/Yuan-embedding-2.0-en | 0.8521 |
| #30 | GritLM/GritLM-8x7B | 0.8491 |
| #31 | Qwen/Qwen3-Embedding-0.6B | 0.8486 |
| #32 | Lajavaness/bilingual-embedding-base | 0.8480 |
| #33 | HIT-TMG/KaLM-embedding-multilingual-mini-v1 | 0.8427 |
| #34 | codefuse-ai/F2LLM-0.6B | 0.8384 |
| #35 | Salesforce/SFR-Embedding-Mistral | 0.8329 |
| #36 | Cohere/Cohere-embed-multilingual-light-v3.0 | 0.8292 |
| #37 | BidirLM/BidirLM-0.6B-Embedding | 0.8258 |
| #38 | Linq-AI-Research/Linq-Embed-Mistral | 0.8239 |
| #39 | Salesforce/SFR-Embedding-2_R | 0.8082 |
| #40 | Lajavaness/bilingual-embedding-small | 0.8036 |
| #41 | Alibaba-NLP/gte-Qwen1.5-7B-instruct | 0.7793 |
| #42 | HIT-TMG/KaLM-embedding-multilingual-mini-instruct-v1 | 0.7389 |
| #43 | BidirLM/BidirLM-270M-Embedding | 0.7361 |
| #44 | Omartificial-Intelligence-Space/Arabert-all-nli-triplet-Matryoshka | 0.7360 |
| #45 | Sailesh97/Hinvec | 0.7247 |
| #46 | Omartificial-Intelligence-Space/Arabic-all-nli-triplet-Matryoshka | 0.7136 |
| #47 | Omartificial-Intelligence-Space/Marbert-all-nli-triplet-Matryoshka | 0.7003 |
| #48 | Omartificial-Intelligence-Space/Arabic-labse-Matryoshka | 0.6788 |
| #49 | NovaSearch/jasper_en_vision_language_v1 | 0.6391 |
| #50 | NovaSearch/stella_en_1.5B_v5 | 0.6054 |
| #51 | BakaSearch（纯 BM25） | 0.4811 ← |
| #52 | BakaSearch（+桥扩展） | 0.4740 ← |
| #53 | Omartificial-Intelligence-Space/Arabic-mpnet-base-all-nli-triplet | 0.4646 |
| #54 | DeepPavlov/rubert-base-cased | 0.4369 |
| #55 | Haon-Chen/speed-embedding-7b-instruct | 0.4044 |
| #56 | bigscience/sgpt-bloom-7b1-msmarco | 0.2051 |
| #57 | Cohere/Cohere-embed-english-v3.0 | 0.1958 |
| #58 | VPLabs/SearchMap_Preview | 0.1929 |
| #59 | NovaSearch/stella_en_400M_v5 | 0.1894 |
| #60 | Jaume/gemma-2b-embeddings | 0.1302 |
| #61 | avsolatorio/GIST-large-Embedding-v0 | 0.1002 |
| #62 | BAAI/bge-base-en-v1.5 | 0.0990 |
| #63 | Cohere/Cohere-embed-english-light-v3.0 | 0.0851 |
| #64 | avsolatorio/GIST-Embedding-v0 | 0.0827 |
| #65 | BAAI/bge-large-en-v1.5 | 0.0804 |
| #66 | WhereIsAI/UAE-Large-V1 | 0.0750 |
| #67 | avsolatorio/GIST-small-Embedding-v0 | 0.0649 |
| #68 | Snowflake/snowflake-arctic-embed-m-long | 0.0623 |
| #69 | avsolatorio/NoInstruct-small-Embedding-v0 | 0.0606 |
| #70 | BAAI/bge-small-en-v1.5 | 0.0572 |
| #71 | Snowflake/snowflake-arctic-embed-m-v1.5 | 0.0551 |
| #72 | abhinand/MedEmbed-small-v0.1 | 0.0546 |
| #73 | Mihaiii/Ivysaur | 0.0545 |
| #74 | Snowflake/snowflake-arctic-embed-l | 0.0507 |
| #75 | Snowflake/snowflake-arctic-embed-s | 0.0446 |
| #76 | Mihaiii/Squirtle | 0.0426 |
| #77 | Snowflake/snowflake-arctic-embed-m | 0.0426 |
| #78 | aari1995/German_Semantic_STS_V2 | 0.0389 |
| #79 | Mihaiii/Venusaur | 0.0341 |
| #80 | Mihaiii/Wartortle | 0.0332 |
| #81 | Snowflake/snowflake-arctic-embed-xs | 0.0309 |
| #82 | DeepPavlov/rubert-base-cased-sentence | 0.0291 |
| #83 | ai-forever/ru-en-RoSBERTa | 0.0260 |
| #84 | ai-forever/sbert_large_mt_nlu_ru | 0.0243 |
| #85 | ai-forever/sbert_large_nlu_ru | 0.0234 |
| #86 | Mihaiii/Bulbasaur | 0.0211 |
| #87 | DeepPavlov/distilrubert-small-cased-conversational | 0.0194 |
| #88 | Mihaiii/gte-micro | 0.0168 |
| #89 | brahmairesearch/slx-v0.1 | 0.0157 |
| #90 | Mihaiii/gte-micro-v4 | 0.0154 |

